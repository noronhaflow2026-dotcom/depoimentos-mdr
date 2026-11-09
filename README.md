# MDR Play — Médicos de Resultado

Catálogo de vídeos com identidade verde profunda e navegação inspirada em streaming. Implementado com React, Vinext, D1 e R2.

## Uso
- Início: banner, destaques e fileiras por categoria.
- Categorias: explorar temas e filtrar histórias.
- Minha lista: favoritos salvos no navegador.
- Admin no rodapé: edição sem login adicional. Quem acessa o admin pode editar o catálogo.
- Vídeos e categorias são salvos imediatamente ao confirmar seus formulários; a aparência possui botão Salvar. Alterações com falha permanecem no painel para nova tentativa.
- Reordenação por arrastar ou setas, destaques, visibilidade e múltiplas categorias por vídeo.
- Uploads de imagens até 15 MB e MP4/WebM até 80 MB. Vídeos maiores podem ser vinculados por URL HTTPS de YouTube, Vimeo ou arquivo direto.
- Exportar/importar JSON preserva metadados; os arquivos enviados continuam vinculados ao armazenamento do Site original.

## Conteúdo de exemplo
12 registros em quatro categorias. Os personagens, imagens e temas dos cards são demonstrativos, identificados no catálogo e no player. O vídeo inicial é uma vinheta demonstrativa local de 12 segundos, sem depoimentos reais. Substitua os registros e seus arquivos no admin antes de usar como prova social.

## Armazenamento
`catalog` guarda o documento validado e a versão para evitar sobrescritas simultâneas. D1 guarda o catálogo compartilhado; R2 guarda uploads. LocalStorage é usado somente para favoritos e progresso individuais.

## Validação realizada
TypeScript, build de produção, revisão visual em desktop e 375 px úteis no mobile, reprodução local e de MP4 enviado, favoritos, criação e remoção de categoria e persistência após recarregamento.

## Desenvolvimento
Use os scripts de Sites para instalação, build, preview e publicação. Migração inicial em drizzle/0000_brief_blade.sql. Migrações locais e hospedadas são independentes. A publicação conserva o catálogo existente; exemplos só são inseridos se o catálogo ainda não existir.

## Entrega do código no GitHub

Cópia do código-fonte do MDR Play. Site atual: https://mdr-historias.wholeshark64.chatgpt.site

### Executar localmente

Requisitos: Node.js >= 22.13 e pnpm 11.25.0 (versão fixada em package.json).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

O projeto usa Vinext/React e Cloudflare Workers, com bindings D1 `DB` e R2 `BUCKET`. A migração SQL está em `drizzle/0000_brief_blade.sql` e precisa ser aplicada ao banco do ambiente. `pnpm build` gera a aplicação de produção.

### Publicação em outra hospedagem

Este repositório não publica automaticamente no GitHub Pages: a aplicação possui API e armazenamento no servidor. Para uma implantação independente, configure Cloudflare Workers, D1 e R2 e adapte a configuração de publicação ao ambiente de destino. O arquivo `.openai/hosting.json` identifica o Site original; não o use para publicar sobre esse Site sem autorização.

O catálogo atual do banco e os arquivos enviados ao R2 não fazem parte do código-fonte. Exporte os metadados pelo admin e migre os arquivos de mídia separadamente. Os assets demonstrativos locais estão incluídos. O admin continua sem autenticação adicional, conforme o funcionamento original.

Esta transferência preserva o código da origem; não implica uma nova validação de build ou uma nova implantação.
