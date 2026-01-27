// EXEMPLO: Como usar imagens locais da pasta /public/img/products/
// Copie este código para products.js quando suas imagens estiverem prontas

export const products = [
    {
        id: 1,
        name: "Camiseta Personalizada",
        description: "Camiseta de alta qualidade com personalização total de cores e logos. Ideal para equipes esportivas e eventos.",
        price: 89.90,
        image: "/img/products/camiseta-personalizada-1.jpg", // ← Imagem principal
        category: "Camisetas",
        isCustomizable: true,
        images: [ // ← Galeria de imagens (múltiplas fotos)
            "/img/products/camiseta-personalizada-1.jpg",
            "/img/products/camiseta-personalizada-2.jpg",
            "/img/products/camiseta-personalizada-3.jpg"
        ]
    },
    {
        id: 2,
        name: "Calção Esportivo Performance",
        description: "Calção leve e resistente, desenvolvido para máxima performance em campo.",
        price: 59.90,
        image: "/img/products/calcao-esportivo-1.jpg",
        category: "Calções",
        isCustomizable: true,
        images: [
            "/img/products/calcao-esportivo-1.jpg",
            "/img/products/calcao-esportivo-2.jpg"
        ]
    },
    {
        id: 3,
        name: "Meia Técnica de Compressão",
        description: "Meias projetadas para conforto e suporte durante atividades intensas.",
        price: 29.90,
        image: "/img/products/meia-compressao-1.jpg",
        category: "Meias",
        isCustomizable: false,
        images: [
            "/img/products/meia-compressao-1.jpg"
        ]
    },
    {
        id: 4,
        name: "Boné Trucker Exclusive",
        description: "Boné estilo trucker com tela e ajuste snapback. Excelente para brindes e marketing.",
        price: 49.90,
        image: "/img/products/bone-trucker-1.jpg",
        category: "Bonés",
        isCustomizable: true,
        images: [
            "/img/products/bone-trucker-1.jpg",
            "/img/products/bone-trucker-2.jpg"
        ]
    },
    {
        id: 5,
        name: "Jaqueta corta-vento Pro",
        description: "Jaqueta leve e impermeável, perfeita para treinos em condições adversas.",
        price: 189.90,
        image: "/img/products/jaqueta-corta-vento-1.jpg",
        category: "Jaquetas",
        isCustomizable: true,
        images: [
            "/img/products/jaqueta-corta-vento-1.jpg",
            "/img/products/jaqueta-corta-vento-2.jpg"
        ]
    },
    {
        id: 6,
        name: "Polo Masculina Casual",
        description: "Camisa polo clássica com toque moderno, ideal para uniformes corporativos.",
        price: 79.90,
        image: "/img/products/polo-masculina-1.jpg",
        category: "Polos",
        isCustomizable: true,
        images: [
            "/img/products/polo-masculina-1.jpg",
            "/img/products/polo-masculina-2.jpg"
        ]
    }
];
