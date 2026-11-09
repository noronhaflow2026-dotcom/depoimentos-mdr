import { env } from 'cloudflare:workers';
export async function POST(request:Request){
 if(request.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Origem não permitida.'},{status:403});
 if(!env.BUCKET)return Response.json({error:'Envio indisponível.'},{status:503});
 const mime=(request.headers.get('content-type')||'').split(';')[0];
 const types:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm'};
 if(!types[mime]||!request.body)return Response.json({error:'Use JPG, PNG, WebP, GIF, MP4 ou WebM.'},{status:400});
 const max=mime.startsWith('video')?80*1024*1024:15*1024*1024;const size=Number(request.headers.get('content-length'));
 if(!size||size>max)return Response.json({error:'Limite de 15 MB por imagem e 80 MB por vídeo. Para vídeos maiores, use um link.'},{status:413});
 const key=crypto.randomUUID()+'.'+types[mime];
 try{await env.BUCKET.put(key,request.body,{httpMetadata:{contentType:mime,cacheControl:'public, max-age=31536000, immutable'}});return Response.json({url:'/api/media/'+key});}
 catch{return Response.json({error:'O arquivo não pôde ser enviado. Tente novamente.'},{status:500});}
}
