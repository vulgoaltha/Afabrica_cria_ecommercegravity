const mercadopago = require('mercadopago');

exports.handler = async (event, context) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { items, payer, orderId } = JSON.parse(event.body);

        // Configurar Mercado Pago
        // IMPORTANTE: Adicione MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente do Netlify
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });

        const preference = {
            items: items.map(item => ({
                title: item.title,
                unit_price: parseFloat(item.price),
                quantity: Number(item.quantity),
                currency_id: 'BRL',
                picture_url: item.image
            })),
            payer: {
                name: payer.name,
                email: payer.email,
                phone: {
                    area_code: payer.phone.substring(0, 2),
                    number: Number(payer.phone.substring(2))
                },
                identification: {
                    type: 'CPF',
                    number: payer.cpf
                },
                address: {
                    zip_code: payer.address.cep,
                    street_name: payer.address.street,
                    street_number: Number(payer.address.number)
                }
            },
            external_reference: orderId,
            back_urls: {
                success: `${event.headers.origin}/success`,
                failure: `${event.headers.origin}/checkout`,
                pending: `${event.headers.origin}/success`
            },
            auto_return: 'approved',
        };

        const response = await mercadopago.preferences.create(preference);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ init_point: response.body.init_point })
        };

    } catch (error) {
        console.error('Erro Mercado Pago:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erro ao criar preferência de pagamento', details: error.message })
        };
    }
};
