import { env } from 'cloudflare:workers';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){
 const {key}=await params;
 if(!/^[a-f0-9-]+\.(jpg|png|webp|gif|mp4|webm)$/.test(key)||!env.BUCKET)return new Response('Não encontrado',{status:404});
 const item=await env.BUCKET.get(key,{range:request.headers});
 if(!item)return new Response('Não encontrado',{status:404});
 const headers=new Headers();item.writeHttpMetadata(headers);headers.set('ETag',item.httpEtag);headers.set('X-Content-Type-Options','nosniff');headers.set('Accept-Ranges','bytes');
 if(item.range){const range=item.range as {offset?:number;length?:number;suffix?:number};const offset=range.offset??Math.max(0,item.size-(range.suffix??item.size));const length=range.length??(item.size-offset);headers.set('Content-Range','bytes '+offset+'-'+(offset+length-1)+'/'+item.size);headers.set('Content-Length',String(length));return new Response(item.body,{status:206,headers});}
 headers.set('Content-Length',String(item.size));return new Response(item.body,{headers});
}
