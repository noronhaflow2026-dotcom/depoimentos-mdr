import { z } from 'zod';
const text = (n: number) => z.string().max(n);
export const mediaUrl = z.string().max(2048).refine(v => !v || /^\/(?:assets|api\/media)\/[A-Za-z0-9_.\/-]+$/.test(v) || /^https:\/\//i.test(v), 'Use um endereço HTTPS ou envie um arquivo.');
export const categorySchema = z.object({id:text(80).min(1),name:text(100).min(1),description:text(600),cover:mediaUrl,visible:z.boolean()});
export const videoSchema = z.object({id:text(80).min(1),title:text(160).min(1),person:text(100),specialty:text(120),description:text(2500),categoryIds:z.array(text(80)).max(40),url:mediaUrl,cover:mediaUrl,portrait:z.number().int().min(0).max(3).nullable(),duration:text(20),featured:z.boolean(),visible:z.boolean(),demo:z.boolean(),tags:text(300)});
export const settingsSchema = z.object({name:text(50).min(1),subtitle:text(100),heroEyebrow:text(120),heroTitle:text(200).min(1),heroDescription:text(600),heroImage:mediaUrl,heroPerson:text(100),accent:z.string().regex(/^#[a-fA-F0-9]{6}$/),footer:text(400),featuredTitle:text(100),featuredDescription:text(200)});
export const catalogSchema = z.object({categories:z.array(categorySchema).max(60),videos:z.array(videoSchema).max(500),settings:settingsSchema}).superRefine((v,ctx)=>{
 if(new Set(v.categories.map(c=>c.id)).size!==v.categories.length || new Set(v.videos.map(c=>c.id)).size!==v.videos.length)ctx.addIssue({code:'custom',message:'Identificadores duplicados.'});
 const ids=new Set(v.categories.map(c=>c.id));if(v.videos.some(x=>x.categoryIds.some(id=>!ids.has(id))))ctx.addIssue({code:'custom',message:'Categoria não encontrada.'});
});
export type Category = z.infer<typeof categorySchema>;
export type Video = z.infer<typeof videoSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export const initialCatalog: Catalog = {
 settings:{name:'MDR',subtitle:'MÉDICOS DE RESULTADO',heroEyebrow:'HISTÓRIAS QUE INSPIRAM',heroTitle:'Toda transformação\ncomeça com uma\ndecisão.',heroDescription:'Novas perspectivas. Escolhas corajosas. Conheça as histórias por trás de uma medicina com mais propósito e resultado.',heroImage:'/assets/gabriel-hero.png',heroPerson:'Dr. Gabriel Maia',accent:'#43ed9b',footer:'Programa Médicos de Resultado · Dr. Gabriel Maia',featuredTitle:'Histórias em destaque',featuredDescription:'Uma nova perspectiva pode começar com um play.'},
 categories:[
 {id:'primeiros-passos',name:'O início de uma nova jornada',description:'O primeiro passo para transformar a sua trajetória.',cover:'',visible:true},
 {id:'crescimento',name:'Consultório em crescimento',description:'Gestão, posicionamento e uma nova visão do negócio.',cover:'',visible:true},
 {id:'liberdade',name:'Mais liberdade, mais vida',description:'Espaço para cuidar da carreira e de tudo o que importa.',cover:'',visible:true},
 {id:'lideranca',name:'De médico a empresário',description:'Uma mudança de mentalidade para liderar o próprio futuro.',cover:'',visible:true}],
 videos:[
 ['a','Uma nova relação com o consultório','Dra. Ana','Dermatologia',0,'primeiros-passos','O ponto de partida para repensar a rotina e o futuro da carreira.'],
 ['b','O próximo capítulo da minha carreira','Dr. Rafael','Cardiologia',1,'primeiros-passos','Novas perspectivas para tomar decisões com mais clareza.'],
 ['c','Clareza para dar o primeiro passo','Dra. Camila','Clínica médica',2,'primeiros-passos','O começo de uma jornada com propósito e direção.'],
 ['d','Um consultório com direção','Dr. Lucas','Ortopedia',3,'crescimento','Uma conversa sobre gestão e a experiência do paciente.'],
 ['e','Posicionamento que faz sentido','Dra. Ana','Dermatologia',0,'crescimento','Como conectar a prática médica à identidade do consultório.'],
 ['f','Crescer com mais organização','Dr. Rafael','Cardiologia',1,'crescimento','Rotina, processos e decisões que apoiam o crescimento.'],
 ['g','Tempo para o que realmente importa','Dra. Camila','Clínica médica',2,'liberdade','Um olhar para o equilíbrio entre a carreira e a vida.'],
 ['h','Minha agenda, novas possibilidades','Dr. Lucas','Ortopedia',3,'liberdade','Reflexões sobre tempo e autonomia profissional.'],
 ['i','Mais presença, dentro e fora do consultório','Dra. Ana','Dermatologia',0,'liberdade','O espaço para viver a medicina de forma mais consciente.'],
 ['j','Uma nova forma de liderar','Dr. Rafael','Cardiologia',1,'lideranca','A transição para uma visão de liderança e gestão.'],
 ['k','O médico por trás do negócio','Dr. Lucas','Ortopedia',3,'lideranca','Conectando o cuidado com a visão empreendedora.'],
 ['l','Assumindo o protagonismo','Dra. Camila','Clínica médica',2,'lideranca','Um novo olhar para construir o próximo capítulo.'],
 ].map((a,i)=>({id:String(a[0]),title:String(a[1]),person:String(a[2]),specialty:String(a[3]),portrait:Number(a[4]),categoryIds:[String(a[5])],description:String(a[6])+' Conteúdo demonstrativo: personagem e tema ilustrativos, sem relato real de mentorado. Substitua pelo seu depoimento no admin.',cover:'',url:'/assets/demo.mp4',duration:'0:12',featured:i<4,visible:true,demo:true,tags:'Exemplo, demonstração'}))
};
export function playerSource(raw:string): {kind:'embed'|'file';url:string} | null {
 if(!raw)return null;
 if(raw.startsWith('/assets/')||raw.startsWith('/api/media/'))return {kind:'file',url:raw};
 try {const u=new URL(raw);if(u.protocol!=='https:')return null;
 if(['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(u.hostname)){
 const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();
 if(!id||!/^[\w-]{11}$/.test(id))return null;return {kind:'embed',url:'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0'};}
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)){
 const parts=u.pathname.split('/').filter(Boolean);const id=parts.find(p=>/^\d+$/.test(p));if(!id)return null;const hash=u.searchParams.get('h')||parts[parts.indexOf(id)+1];
 return {kind:'embed',url:'https://player.vimeo.com/video/'+id+'?autoplay=1'+(hash?'&h='+encodeURIComponent(hash):'')};}
 return {kind:'file',url:raw};}catch{return null;}
}
