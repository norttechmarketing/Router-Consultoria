# Router Consultoria & Informática

Site em React, TypeScript e Vite, com HTML pré-renderizado na compilação.

## Rodar e publicar

Use Node.js 22.12 ou posterior da série 22.

1. Execute npm ci.
2. Execute npm run dev para a prévia.
3. Execute npm run build para gerar dist.

Para publicar na Vercel, envie o conteúdo deste ZIP à raiz do projeto. O arquivo vercel.json usa o preset Vite e a pasta dist.

## Atualizações

- catálogo: edite catalogo.json com as linhas de produtos. As chaves de ícones aceitas são computer, keyboard, scan, wifi, printer e chip.
- contato: edite contato.json. Use o número de WhatsApp comercial com código do país e DDD, apenas números. Exemplo de formato: 5514XXXXXXXXX.
- imagens da marca: public/router.png e public/selo.png.
- conteúdo: src.tsx. Aparência: style.css.

O catálogo não consulta estoque nem preços. Uma integração futura depende da fonte de dados utilizada pela Router. A página prepara a mensagem no navegador. Com WhatsApp configurado, o visitante pode abrir a conversa para revisá-la e enviar.

O telefone fixo e a cidade constam na autorização de fornecimento 5480/2025 da Prefeitura de Pederneiras. Confirme o endereço de atendimento e o WhatsApp comercial antes de divulgá-los.
https://web.pederneiras.sp.gov.br/images/arquivos/licitacoes/atuais/AF5480-TONERCTA.pdf
