import { validateSave, clone } from './engine.js';

// The engine knows nothing about browser storage. A future cloud adapter can
// implement this interface without changing action or combat simulation.
export class SaveAdapter {
  constructor(namespace = 'hearthwild', options = {}) {
    this.namespace = namespace;
    this.key = namespace + '.save.v1';
    this.backup = this.key + '.backup';
    this.lease = this.key + '.writer';
    this.db = null;
    this.mode = 'localStorage';
    this.queue = Promise.resolve();
    this.owner = globalThis.crypto?.randomUUID?.() || String(Math.random());
    this.writer = false;
    this.usingLocks = !!globalThis.navigator?.locks && !options.leaseOnly;
    this.lastSaved = 0;
    this.error = '';
  }

  async open() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const r = indexedDB.open(this.namespace, 1);
        r.onupgradeneeded = () => r.result.createObjectStore('saves');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
        r.onblocked = () => reject(Error('Save database blocked'));
      });
      this.mode = 'IndexedDB';
    } catch { this.db = null; }
    return this;
  }

  async acquire() {
    if (this.usingLocks) {
      let release;
      const hold = new Promise(r => release = r);
      await new Promise(resolve => {
        navigator.locks.request(this.key, { ifAvailable: true }, async lock => {
          this.writer = !!lock;
          resolve();
          if (lock) { this.lockRelease = release; await hold; }
        }).catch(() => resolve());
      });
    } else {
      try {
        const old = JSON.parse(localStorage.getItem(this.lease) || 'null');
        if (!old || old.until < Date.now()) {
          localStorage.setItem(this.lease, JSON.stringify({ id: this.owner, until: Date.now() + 15000 }));
          await new Promise(r => setTimeout(r, 100));
          this.writer = JSON.parse(localStorage.getItem(this.lease) || 'null')?.id === this.owner;
        }
      } catch { this.error = 'Browser storage unavailable'; }
    }
    if (this.writer && !this.usingLocks) {
      this.heartbeat = setInterval(() => {
        try {
          const old = JSON.parse(localStorage.getItem(this.lease) || 'null');
          if (old?.id !== this.owner) { this.writer = false; return; }
          localStorage.setItem(this.lease, JSON.stringify({ id: this.owner, until: Date.now() + 15000 }));
        } catch { this.writer = false; }
      }, 3000);
    }
    return this.writer;
  }

  owns() {
    if (!this.writer) return false;
    if (this.usingLocks) return true;
    try {
      const lease = JSON.parse(localStorage.getItem(this.lease) || 'null');
      return lease?.id === this.owner && lease.until > Date.now();
    } catch { return false; }
  }

  async get(key) {
    if (!this.db) return localStorage.getItem(key);
    return new Promise((resolve, reject) => {
      const r = this.db.transaction('saves').objectStore('saves').get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }

  async load() {
    const candidates = [];
    let failures = 0;
    // Check both backends: a prior session may have needed the fallback.
    for (const key of [this.key, this.backup]) {
      const reads = [() => this.get(key)];
      if (this.db) reads.push(() => localStorage.getItem(key));
      for (const read of reads) {
        try {
          const text = await read();
          if (text) candidates.push({ state: validateSave(JSON.parse(text)), backup: key === this.backup });
        } catch { failures++; }
      }
    }
    candidates.sort((a, b) => b.state.revision - a.state.revision || b.state.clock - a.state.clock || Number(a.backup) - Number(b.backup));
    if (candidates.length) {
      this.recovered = candidates[0].backup;
      this.revision = candidates[0].state.revision;
      return candidates[0].state;
    }
    if (failures) this.error = 'Saved data was damaged. No valid recovery copy was found; import an exported backup.';
    return null;
  }

  writeFallback(text) {
    const old = localStorage.getItem(this.key);
    if (old) {
      try { validateSave(JSON.parse(old)); localStorage.setItem(this.backup, old); } catch { /* preserve good recovery data */ }
    }
    localStorage.setItem(this.key, text);
  }

  save(snapshot) {
    const s = clone(snapshot);
    this.queue = this.queue.catch(() => {}).then(async () => {
      if (!this.owns()) throw Error('Read-only tab — another tab owns this save');
      validateSave(s);
      s.revision = Math.max(s.revision || 0, this.revision || 0) + 1;
      const text = JSON.stringify(s);
      if (this.db) {
        try {
          await new Promise((resolve, reject) => {
            const tx = this.db.transaction('saves', 'readwrite');
            const st = tx.objectStore('saves');
            const r = st.get(this.key);
            r.onsuccess = () => {
              if (r.result) {
                try { validateSave(JSON.parse(r.result)); st.put(r.result, this.backup); } catch { /* do not back up corrupt bytes */ }
              }
              st.put(text, this.key);
            };
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || Error('Save aborted'));
          });
          // A stale fallback must not resurrect an older adventure after import.
          try { localStorage.removeItem(this.key); localStorage.removeItem(this.backup); } catch { /* IndexedDB remains authoritative */ }
        } catch {
          this.db.close();
          this.db = null;
          this.mode = 'localStorage';
          this.writeFallback(text);
        }
      } else this.writeFallback(text);
      this.revision = s.revision;
      this.lastSaved = Date.now();
      this.error = '';
      return s.revision;
    });
    return this.queue;
  }

  export(snapshot) { return JSON.stringify(validateSave(snapshot), null, 2); }
  async import(text) {
    const s = validateSave(JSON.parse(text));
    await this.save(s);
    return s;
  }
  async reset() {
    if (!this.owns()) throw Error('Read-only tab');
    await this.queue.catch(() => {});
    if (this.db) await new Promise((resolve, reject) => {
      const tx = this.db.transaction('saves', 'readwrite');
      tx.objectStore('saves').clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    localStorage.removeItem(this.key);
    localStorage.removeItem(this.backup);
  }
  close() {
    clearInterval(this.heartbeat);
    this.lockRelease?.();
    if (!this.usingLocks && this.owns()) localStorage.removeItem(this.lease);
    this.writer = false;
    this.db?.close();
  }
}
