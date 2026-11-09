import { env } from 'cloudflare:workers';
import { catalogSchema, initialCatalog } from '@/lib/catalog';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
async function ensure(){
 if(!env.DB)throw new Error('Banco indisponível.');
 await env.DB.prepare('INSERT OR IGNORE INTO catalog (id,payload,version,updated_at) VALUES (?,?,?,?)').bind('main',JSON.stringify(initialCatalog),1,new Date().toISOString()).run();return env.DB;
}
export async function GET(){
 try{const db=await ensure();const row=await db.prepare('SELECT payload,version,updated_at FROM catalog WHERE id=?').bind('main').first<{payload:string;version:number;updated_at:string}>();
 return json({catalog:JSON.parse(row!.payload),version:row!.version,updatedAt:row!.updated_at});}catch{return json({error:'Não foi possível carregar o catálogo. Tente novamente.'},503);}
}
export async function PUT(request:Request){
 if(request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Origem não permitida.'},403);
 try{const raw=await request.text();if(raw.length>1000000)return json({error:'Catálogo excede o tamanho permitido.'},413);
 const body=JSON.parse(raw);const parsed=catalogSchema.safeParse(body.catalog);
 if(!parsed.success||!Number.isInteger(body.version))return json({error:parsed.success?'Versão inválida.':parsed.error.issues[0]?.message},400);
 const db=await ensure();const now=new Date().toISOString();
 const result=await db.prepare('UPDATE catalog SET payload=?,version=version+1,updated_at=? WHERE id=? AND version=?').bind(JSON.stringify(parsed.data),now,'main',body.version).run();
 if(!result.meta.changes)return json({error:'O catálogo foi alterado em outra aba. Exporte sua cópia, recarregue e tente novamente.'},409);
 return json({version:body.version+1,updatedAt:now});}catch{return json({error:'Não foi possível salvar. Suas edições permanecem nesta tela.'},500);}
}
