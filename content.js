/* Hearthwild — original content, stable IDs. No external dependencies. */
export const VERSION='1.0.0';
export const skillNames=['Attack','Strength','Defence','Hitpoints','Ranged','Magic','Prayer','Slayer','Woodcutting','Fishing','Firemaking','Cooking','Mining','Smithing','Thieving','Farming','Fletching','Crafting','Runecrafting','Herblore','Agility','Astrology','Summoning','Township','Archaeology','Ranching','Hunting','Beastcrafting','Construction'];
export const sid=n=>n.toLowerCase();
export const skills=Object.fromEntries(skillNames.map((name,i)=>[sid(name),{id:sid(name),name,combat:i<8,passive:['Farming','Ranching','Township'].includes(name),icon:['⚔','◆','🛡','♥','➶','✦','☼','☠','♣','≈','♨','♨','⛏','⚒','♠','❀','➹','◇','✧','⚗','↗','☾','✶','⌂','▧','♞','⌁','♜','▥'][i]}]));
export const tiers=['Ash','Copperleaf','Willow','Ironbark','Amber','Silverpine','Cobalt','Moonwood','Sunstone','Starfall','Eclipse','Worldroot'];
export const req=t=>t===0?1:t*10;
export const items={},actions={},monsters={},dungeons={},spells={},prayers={},pets={},quests={},achievements={},buildings={};
const put=(id,name,category,value,extra={})=>items[id]={id,name,category,value,description:extra.description||`${name}: a resource of the ${tiers[extra.tier||0]} frontier.`,...extra};
const act=(id,skill,name,t,inputs,outputs,extra={})=>actions[id]={id,skillId:skill,name,tier:t,requiredLevel:req(t),durationMs:3000+t*350,xp:18*Math.pow(1.82,t),inputs,outputs,...extra};
put('coins','Gold','currency',0);put('bones','Weathered bones','prayer',3);put('stardust','Stardust','astrology',30);put('townwood','Settlement timber','township',5);put('townstone','Settlement stone','township',5);put('compost','Compost','farming',8);put('relic','Restored relic','archaeology',200);put('slayercoin','Hunt marks','slayer',0);put('ration','Trail ration','food',12,{heal:14,description:'Starter healing food. Cook fish for more.'});
export const slots=['weapon','offhand','head','chest','legs','hands','feet','amulet','ring','cape'];
for(let t=0;t<12;t++){
 const p=tiers[t], val=Math.round(4*Math.pow(1.8,t));
 for(const [key,name,cat] of [['log','log','wood'],['ore','ore','mining'],['bar','ingot','smithing'],['fish','riverfish','fishing'],['food','roast','food'],['seed','seed','farming'],['herb','herb','herblore'],['hide','hide','hunting'],['fang','fang','beastcrafting'],['fiber','fleece','ranching'],['egg','egg','ranching'],['rune','rune','rune'],['arrow','arrows','ammunition'],['artifact','fragment','archaeology'],['potion','tonic','potion'],['tablet','familiar tablet','summoning'],['gem','gem','gem']])put(`${key}${t}`,`${p} ${name}`,cat,val,{tier:t,...(key==='food'?{heal:12+t*13}:{}),...(key==='potion'?{charges:50+t*10,power:0.04+t*0.012}:{}),...(key==='tablet'?{charges:100,power:0.03+t*0.012}:{} )});
 act('wood'+t,'woodcutting',`Cut ${p}`,t,{}, {['log'+t]:1}, {drops:[{id:'seed'+t,chance:.015,qty:1}],node:'Trees never deplete'});
 act('fish'+t,'fishing',`Fish ${p} waters`,t,{}, {['fish'+t]:1},{chance:.92,drops:[{id:'gem'+t,chance:.002,qty:1}]});
 act('burn'+t,'firemaking',`Tend ${p} fire`,t,{['log'+t]:1},{},{effect:'heat'});
 act('omelet'+t,'cooking',`Cook ${p} field omelet`,t,{['egg'+t]:2,['herb'+t]:1},{['food'+t]:3},{chance:.95});
 act('cook'+t,'cooking',`Roast ${p} riverfish`,t,{['fish'+t]:1},{['food'+t]:1},{chance:Math.min(.98,.8+t*.015)});
 act('mine'+t,'mining',`Mine ${p} seam`,t,{}, {['ore'+t]:1},{durationMs:4200+t*500,drops:[{id:'gem'+t,chance:.012,qty:1}],node:'Mining time includes seam regeneration'});
 act('smelt'+t,'smithing',`Smelt ${p}`,t,{['ore'+t]:2},{['bar'+t]:1});
 act('steal'+t,'thieving',`Pickpocket ${p} caravan`,t,{}, {coins:val*3,['seed'+t]:1},{chance:Math.max(.4,.85-t*.025),damage:2+t*3});
 act('grow'+t,'farming',`Plant ${p} herbs`,t,{['seed'+t]:1},{['herb'+t]:8,['seed'+t]:1},{durationMs:(300+t*120)*1000,passive:true});
 act('arrows'+t,'fletching',`Fletch ${p} arrows`,t,{['log'+t]:1,['bar'+t]:1},{['arrow'+t]:30});
 act('runes'+t,'runecrafting',`Inscribe ${p} runes`,t,{['ore'+t]:1},{['rune'+t]:12});
 act('potion'+t,'herblore',`Brew ${p} tonic`,t,{['herb'+t]:2,['fish'+t]:1},{['potion'+t]:1});
 act('course'+t,'agility',`Run ${p} course`,t,{}, {coins:val},{effect:'agility',durationMs:6500+t*500});
 act('stars'+t,'astrology',`Study ${p} constellation`,t,{}, {stardust:1},{durationMs:5500+t*500});
 act('tablet'+t,'summoning',`Bind ${p} familiar`,t,{['fang'+t]:1,['rune'+t]:2},{['tablet'+t]:1});
 act('dig'+t,'archaeology',`Excavate ${p} ruins`,t,{}, {['artifact'+t]:1},{durationMs:6000+t*450});
 act('restore'+t,'archaeology',`Restore ${p} relic`,t,{['artifact'+t]:6,['bar'+t]:1},{relic:1},{effect:'relic'});
 act('ranch'+t,'ranching',`Raise ${p} woolbeasts`,t,{['fish'+t]:2},{['fiber'+t]:3,['egg'+t]:2},{passive:true,durationMs:(180+t*90)*1000});
 act('hunt'+t,'hunting',`Track ${p} prowlers`,t,{}, {['hide'+t]:1,['fang'+t]:1},{chance:.8,durationMs:6000+t*500});
 act('town'+t,'township',`Manage ${p} settlement`,t,{['log'+t]:2,['ore'+t]:2},{townwood:4+t,townstone:4+t,coins:val*15},{passive:true,durationMs:60000+t*10000});
 act('buildmat'+t,'construction',`Prepare ${p} building stock`,t,{['log'+t]:2,['bar'+t]:1},{townwood:5+t,townstone:5+t},{durationMs:5000+t*500});
 // Each tier gives a full style-specific equipment ladder, accessories and specialist tools.
 for(const style of ['melee','ranged','magic'])for(const slot of slots){
  if(style!=='melee'&&slot==='offhand')continue;
  const id=`${style}_${slot}${t}`;
  const label={weapon:{melee:'sabre',ranged:'longbow',magic:'staff'}[style],offhand:'shield',head:'hood',chest:'coat',legs:'leggings',hands:'gloves',feet:'boots',amulet:'amulet',ring:'ring',cape:'mantle'}[slot];
  const skill=style==='melee'?'smithing':style==='ranged'?(slot==='weapon'?'fletching':'crafting'):'runecrafting';
  const material=style==='melee'?'bar':style==='ranged'?(slot==='weapon'?'log':'hide'):'fiber';
  put(id,`${p} ${style} ${label}`,'equipment',val*(slot==='weapon'?24:14),{tier:t,slot,style,requiredLevel:req(t),twoHanded:slot==='weapon'&&style!=='melee',power:slot==='weapon'?4+t*8:1+t,armor:['head','chest','legs','offhand'].includes(slot)?2+t*3:0,skillReq:style==='melee'?'attack':style});
  act('make_'+id,skill,`Make ${items[id].name}`,t,{[material+t]:slot==='weapon'?3:2,...(style==='magic'?{['rune'+t]:4}:{}),...(['ring','amulet'].includes(slot)?{['gem'+t]:1}:{})},{[id]:1},{xp:45*Math.pow(1.82,t)});
 }
 put('charm'+t,`${p} beast charm`,'equipment',val*25,{tier:t,slot:'amulet',style:'any',power:2+t*2,armor:1+t,requiredLevel:req(t),skillReq:'beastcrafting'});
 act('charm'+t,'beastcrafting',`Shape ${p} beast charm`,t,{['fang'+t]:4,['hide'+t]:2,['gem'+t]:1},{['charm'+t]:1});
 act('compost'+t,'crafting',`Compost ${p} offcuts`,t,{['herb'+t]:1,['log'+t]:1},{compost:3+t});
}
for(let i=0;i<150;i++){
 const t=Math.min(11,Math.floor(i/13)), j=i%13;
 const forms=['Moss rat','Thorn beetle','Gravel imp','Briar wolf','Hollow thief','Ash stalker','Reed drake','Iron revenant','Night weaver','Frost warden','Rune sentinel','Cinder knight','Veil hunter'];
 const id='mob'+i;
 monsters[id]={id,name:`${tiers[t]} ${forms[j]}`,tier:t,level:req(t),hp:18+Math.round(Math.pow(t+1,2)*11)+j*5,power:2+t*7+j,armor:t*3,accuracy:35+t*20,interval:3000+(j%4)*350,type:['melee','ranged','magic'][j%3],slayer:j===12,loot:[{id:'bones',qty:1,chance:1},{id:'coins',qty:10+t*40+j*3,chance:1},{id:'hide'+t,qty:1,chance:.65},{id:'fang'+t,qty:1,chance:.35},{id:'seed'+t,qty:1,chance:.15},{id:'gem'+t,qty:1,chance:.025}]};
}
for(let i=0;i<15;i++){
 const t=Math.min(11,i),waves=['mob'+Math.min(149,t*13),'mob'+Math.min(149,t*13+4),'boss'+i*2,'boss'+(i*2+1)];
 for(let k=0;k<2;k++){
 const id='boss'+(i*2+k);monsters[id]={id,name:`${['Keeper','Sovereign'][k]} of ${tiers[t]} ${['Vault','Bastion','Spire'][i%3]}`,tier:t,level:req(t),hp:100+Math.pow(t+1,2)*32+k*70,power:7+t*10,armor:4+t*5,accuracy:50+t*24,interval:3300,type:['melee','ranged','magic'][i%3],boss:true,special:['fury','venom','siphon'][i%3],loot:[{id:'coins',qty:100*(t+1),chance:1},{id:'gem'+t,qty:2,chance:1},{id:'bones',qty:5,chance:1}]};
 }
 const trophy='trophy'+i;put(trophy,`${tiers[t]} ${['Vault','Bastion','Spire'][i%3]} seal`,'trophy',500*(i+1),{tier:t,description:'A dungeon completion trophy. Keep it, or sell it for gold.'});
 dungeons['dungeon'+i]={id:'dungeon'+i,name:`${tiers[t]} ${['Vault','Bastion','Spire'][i%3]}`,level:req(t),tier:t,waves,reward:{[trophy]:1,coins:200*(i+1)},prereq:i>0?'dungeon'+(i-1):null};
}
for(let i=0;i<40;i++)spells['spell'+i]={id:'spell'+i,name:`${['Ember','Tide','Gale','Stone'][i%4]} ${['Spark','Lance','Surge','Tempest','Rift','Nova','Judgment','Cataclysm','Ascension','Eternity'][Math.floor(i/4)]}`,level:Math.min(115,1+i*3),tier:Math.min(11,Math.floor(i/4)),power:3+i*3,runes:1+Math.floor(i/12),status:i%4===0?'burn':i%4===1?'heal':i%4===2?'slow':'pierce'};
for(let i=0;i<34;i++)prayers['prayer'+i]={id:'prayer'+i,name:`${['Might','Ward','Precision'][i%3]} ${Math.floor(i/3)+1}`,level:1+i*3,power:.025+Math.floor(i/3)*.012,kind:['damage','armor','accuracy'][i%3],cost:1+Math.floor(i/9)};
for(const [i,s] of Object.keys(skills).entries())pets['pet_'+s]={id:'pet_'+s,name:`${['Pip','Bramble','Wisp','Pebble','Thistle','Mote','Clover'][i%7]}, ${skills[s].name} companion`,skill:s,bonus:i%3===0?'speed':i%3===1?'xp':'double',power:.06,description:'Rarely found while training this skill. One companion can be active.'};
for(const [i,s] of Object.keys(skills).entries())for(let j=0;j<4;j++){
 const id=`quest_${s}_${j}`;quests[id]={id,name:`${skills[s].name}: ${['First steps','Proven hands','Frontier expert','Beyond the veil'][j]}`,prereq:j?`quest_${s}_${j-1}`:null,objective:{type:'level',skill:s,value:[5,25,60,100][j]},reward:{coins:[150,2000,25000,300000][j],...(!skills[s].combat?{['seed'+Math.min(11,j*3)]:5}:{ration:10})}};
}
const journey=[['obtain','log0',10],['action','smelt0',5],['action','make_melee_weapon0',1],['kill','mob0',5],['dungeon','dungeon0',1],['building','workshop',1],['consume','food0',5],['action','grow0',5]];
journey.forEach(([type,target,value],i)=>quests['journey'+i]={id:'journey'+i,name:['Gather the hearthwood','The first forge','An honest blade','Keep the roads safe','The sealed vault','A place to work','A well-fed expedition','Roots of tomorrow'][i],prereq:i?'journey'+(i-1):null,objective:{type,target,value},reward:{coins:(i+1)*500,ration:10}});
for(const s of Object.keys(skills))for(const v of [10,30,60,90,120])achievements[`level_${s}_${v}`]={id:`level_${s}_${v}`,name:`${skills[s].name} ${v}`,objective:{type:'level',skill:s,value:v},reward:100*v};
for(const n of [10,100,1000,10000,100000])achievements['kills'+n]={id:'kills'+n,name:`${n.toLocaleString()} victories`,objective:{type:'counter',target:'kills',value:n},reward:n};
for(const [id,name,bonus,cost] of [['workshop','Workshop','speed',1000],['library','Archive','xp',1500],['hearth','Grand hearth','heal',800],['granary','Granary','yield',1200],['watchtower','Watchtower','armor',2000],['stable','Familiar stable','damage',1800]])buildings[id]={id,name,bonus,cost,max:12};
export const shop={seed0:12,ration:35,compost:15};
export const contentCounts=()=>Object.fromEntries(Object.entries({skills,items,actions,monsters,dungeons,spells,prayers,pets,quests,achievements}).map(([k,v])=>[k,Object.keys(v).length]));
export function validateContent(){
 const errors=[];const itemRef=(id,at)=>{if(!items[id])errors.push(`${at}: missing item ${id}`)};
 for(const a of Object.values(actions)){if(!skills[a.skillId])errors.push(a.id+': skill');if(!(a.durationMs>0&&a.xp>0))errors.push(a.id+': timing');for(const [id,n] of Object.entries({...a.inputs,...a.outputs})){itemRef(id,a.id);if(!(n>0&&Number.isInteger(n)))errors.push(a.id+': quantity')}for(const d of a.drops||[])itemRef(d.id,a.id)}
 for(const m of Object.values(monsters))for(const d of m.loot){itemRef(d.id,m.id);if(d.chance<0||d.chance>1)errors.push(m.id+': chance')}
 for(const d of Object.values(dungeons)){d.waves.forEach(id=>{if(!monsters[id])errors.push(d.id+': monster')});Object.keys(d.reward).forEach(id=>itemRef(id,d.id))}
 // Reachability fixed point over sources and recipe inputs, rather than counting definitions.
 const reachable=new Set(['coins','ration','seed0','compost','bones','slayercoin']);
 for(const a of Object.values(actions))if(!Object.keys(a.inputs).length){Object.keys(a.outputs).forEach(id=>reachable.add(id));(a.drops||[]).forEach(d=>reachable.add(d.id))}
 for(const m of Object.values(monsters))m.loot.forEach(d=>reachable.add(d.id));for(const d of Object.values(dungeons))Object.keys(d.reward).forEach(id=>reachable.add(id));
 let changed=true;while(changed){changed=false;for(const a of Object.values(actions))if(Object.keys(a.inputs).every(id=>reachable.has(id)))for(const id of [...Object.keys(a.outputs),...(a.drops||[]).map(d=>d.id)])if(!reachable.has(id)){reachable.add(id);changed=true}}
 for(const id of Object.keys(items))if(!reachable.has(id))errors.push('No reachable source: '+id);
 for(const q of Object.values(quests)){if(q.prereq&&!quests[q.prereq])errors.push(q.id+': prerequisite');const o=q.objective;if(o.type==='action'&&!actions[o.target]||o.type==='kill'&&!monsters[o.target]||o.type==='dungeon'&&!dungeons[o.target]||o.type==='building'&&!buildings[o.target])errors.push(q.id+': objective');Object.keys(q.reward).forEach(id=>itemRef(id,q.id))}
 return errors;
}
