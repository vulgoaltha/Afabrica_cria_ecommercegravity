# 📁 Pasta de Imagens dos Produtos

## Como usar:

1. **Coloque suas imagens aqui** com nomes descritivos, por exemplo:
   - `camiseta-personalizada-1.jpg`
   - `camiseta-personalizada-2.jpg`
   - `calcao-esportivo-1.jpg`
   - `meia-compressao-1.jpg`
   - `bone-trucker-1.jpg`
   - `jaqueta-corta-vento-1.jpg`
   - `polo-masculina-1.jpg`

2. **No arquivo `src/data/products.js`**, referencie as imagens assim:
   ```javascript
   image: "/img/products/camiseta-personalizada-1.jpg"
   ```

3. **Para múltiplas imagens** (galeria):
   ```javascript
   images: [
       "/img/products/camiseta-personalizada-1.jpg",
       "/img/products/camiseta-personalizada-2.jpg",
       "/img/products/camiseta-personalizada-3.jpg"
   ]
   ```

## Formatos recomendados:
- JPG/JPEG (melhor para fotos)
- PNG (melhor para imagens com transparência)
- WebP (melhor compressão, mais moderno)

## Tamanho recomendado:
- Largura: 800-1200px
- Qualidade: 80-90%
- Peso: menos de 500KB por imagem
