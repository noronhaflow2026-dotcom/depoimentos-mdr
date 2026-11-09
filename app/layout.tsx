import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"MDR Play — Médicos de Resultado",description:"Histórias que inspiram o próximo passo. Conheça a experiência de mentorados do Programa Médicos de Resultado, do Dr. Gabriel Maia.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>}
