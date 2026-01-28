
const PROJECT_ID = "afabricacriaecommercegravity";
const API_KEY = "AIzaSyCd9i7k3EywIK56nQy9alVmf_DbY6OV1WI";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Helper to convert JS Object to Firestore JSON format
 */
function toFirestoreValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
        if (Number.isInteger(value)) return { integerValue: value.toString() };
        return { doubleValue: value };
    }
    if (typeof value === 'string') return { stringValue: value };
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(toFirestoreValue) } };
    }
    if (typeof value === 'object') {
        const fields = {};
        for (const k in value) {
            fields[k] = toFirestoreValue(value[k]);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
}

async function createDocument(collection, data) {
    const url = `${BASE_URL}/${collection}?key=${API_KEY}`;
    const body = JSON.stringify({
        fields: toFirestoreValue(data).mapValue.fields
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`HTTP ${response.status}: ${err}`);
        }
        return true;
    } catch (e) {
        console.error(`Falha ao criar documento: ${e.message}`);
        return false;
    }
}

const ORIGINAL_PRODUCTS = [
    { title: "Camiseta", description: "Camiseta de alta qualidade com personalização.", price_in_cents: 8990, image: "/img/products/chave.png", category: "Camisetas", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG', 'XG'] },
    { title: "Calção Esportivo", description: "Calção leve e resistente.", price_in_cents: 5990, image: "/img/products/cavadinha.png", category: "Calções", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Short Passeio", description: "Conforto e lazer.", price_in_cents: 2990, image: "/img/products/passeio.png", category: "Shorts", customizable: false, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Boné Trucker", description: "Boné estilo trucker.", price_in_cents: 4990, image: "/img/products/Boné 3.png", category: "Bonés", customizable: true, stock: 50, sizes: ['U'] },
    { title: "Jaqueta Corta-Vento", description: "Leve e impermeável.", price_in_cents: 18990, image: "/img/products/kebrada com manga.png", category: "Jaquetas", customizable: true, stock: 20, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Polo Casual", description: "Clássica e moderna.", price_in_cents: 7990, image: "/img/products/malako.png", category: "Polos", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] }
];

async function run() {
    console.log("Iniciando restauração via REST API...");

    // 1. Restore Originals
    for (const p of ORIGINAL_PRODUCTS) {
        process.stdout.write(`Restaurando ${p.title}... `);
        const success = await createDocument("products", {
            ...p,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log(success ? "OK" : "ERRO");
    }

    // 2. Create 80 random
    console.log("Criando 80 produtos adicionais...");
    for (let i = 1; i <= 80; i++) {
        const p = {
            title: `Produto #${i}`,
            description: "Descrição de exemplo para preenchimento de catálogo.",
            price_in_cents: Math.floor(Math.random() * 20000) + 5000,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            category: "Geral",
            sizes: ['P', 'M'],
            stock: 100,
            customizable: false
        };
        await createDocument("products", p);
        if (i % 10 === 0) process.stdout.write(`${i}.. `);
    }

    console.log("\nCONCLUÍDO!");
}

run();
