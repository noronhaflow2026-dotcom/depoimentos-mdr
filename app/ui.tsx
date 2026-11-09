'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X, Upload, LoaderCircle, ImageIcon } from 'lucide-react';
import type { Video } from '@/lib/catalog';

export function Artwork({video,className=''}:{video:Video;className?:string}){
 return video.cover ? <img className={'artwork '+className} src={video.cover} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/> : video.portrait!==null ? <div className={'artwork portrait portrait-'+video.portrait+' '+className} /> : <div className={'artwork placeholder '+className}><ImageIcon/></div>;
}
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();const prior=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog?.close();document.body.style.overflow=prior}},[]);
 return <dialog ref={ref} className={'modal '+(wide?'modal-wide':'')} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}} aria-label={title}><div className="modal-inner"><div className="modal-head"><h2>{title}</h2><button className="icon-button" aria-label="Fechar" onClick={onClose}><X/></button></div>{children}</div></dialog>;
}
export function MediaField({label,value,onChange,video=false}:{label:string;value:string;onChange:(url:string)=>void;video?:boolean}){
 const [uploading,setUploading]=useState(false);const [error,setError]=useState('');const input=useRef<HTMLInputElement>(null);
 async function upload(file?:File){if(!file)return;const max=(video?80:15)*1024*1024;if(file.size>max){setError('O limite é '+(video?'80 MB. Para vídeos maiores, cole um link.':'15 MB.'));return;}
 setUploading(true);setError('');try{const r=await fetch('/api/media',{method:'POST',headers:{'Content-Type':file.type},body:file});const result=await r.json() as {url:string;error?:string};if(!r.ok)throw new Error(result.error);onChange(result.url);}catch(e){setError(e instanceof Error?e.message:'Falha no envio.');}finally{setUploading(false);if(input.current)input.current.value='';}}
 return <div className="field"><span>{label}</span><div className="media-input"><input aria-label={label} value={value} onChange={e=>onChange(e.target.value)} placeholder={video?'Link do YouTube, Vimeo ou MP4':'https://… ou envie uma imagem'}/><button type="button" className="button secondary small" onClick={()=>input.current?.click()} disabled={uploading}>{uploading?<LoaderCircle className="spin"/>:<Upload/>}{uploading?'Enviando…':'Enviar'}</button><input ref={input} type="file" hidden accept={video?'video/mp4,video/webm':'image/jpeg,image/png,image/webp,image/gif'} onChange={e=>upload(e.target.files?.[0])}/></div><small>{video?'YouTube, Vimeo, MP4 ou WebM. Envio de até 80 MB.':'JPG, PNG, WebP ou GIF, até 15 MB. Formato recomendado: 16:9.'}</small>{error&&<p role="alert" className="field-error">{error}</p>}</div>;
}
