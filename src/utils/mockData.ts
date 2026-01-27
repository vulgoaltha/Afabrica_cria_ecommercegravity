export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'futebol' | 'treino' | 'streetwear' | 'empresas' | 'eventos';
    image: string;
    description: string;
    isCustomizable: boolean;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Jersey Urban Elite - Black/Gold',
        price: 189.90,
        category: 'futebol',
        image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1470&auto=format&fit=crop',
        description: 'Uniforme de alta performance com detalhes dourados em silk 3D.',
        isCustomizable: true
    },
    {
        id: '2',
        name: 'Camisa Street Crew Oversized',
        price: 129.90,
        category: 'streetwear',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1374&auto=format&fit=crop',
        description: 'Oversized em algodão premium para o dia a dia urbano.',
        isCustomizable: true
    },
    {
        id: '3',
        name: 'Conjunto Treino Pro - Cinza',
        price: 219.90,
        category: 'treino',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
        description: 'Combo de regata e shorts com tecnologia de absorção de suor.',
        isCustomizable: true
    },
    {
        id: '4',
        name: 'Uniforme Corporativo Tech',
        price: 159.90,
        category: 'empresas',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1074&auto=format&fit=crop',
        description: 'Identidade visual para sua equipe com conforto e estilo.',
        isCustomizable: true
    },
    {
        id: '5',
        name: 'Jersey Retrô - 90s Vibes',
        price: 199.90,
        category: 'futebol',
        image: 'https://images.unsplash.com/photo-1551854716-8b811be39e7e?q=80&w=1374&auto=format&fit=crop',
        description: 'Estilo clássico dos anos 90 com personalização moderna.',
        isCustomizable: true
    },
    {
        id: '6',
        name: 'Moletom Factory Hoodie',
        price: 249.90,
        category: 'streetwear',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1374&auto=format&fit=crop',
        description: 'Pesado, quente e com o logo bordado em alta definição.',
        isCustomizable: false
    }
];
