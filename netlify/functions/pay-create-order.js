// Pay Subdomain - Create Razorpay Order
// Netlify Serverless Function
// POST /.netlify/functions/pay-create-order

const https = require('https');

// Razorpay credentials for Pay subdomain
const RAZORPAY_KEY_ID = 'rzp_test_RzG65cnAOq1VuF';
const RAZORPAY_KEY_SECRET = 'PG3yS8CinpQXyLVq49aCiJVx';

exports.handler = async (event) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle Preflight OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { amount, student_id, course_id } = JSON.parse(event.body);

        // Validate required fields
        if (!amount || !student_id || !course_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create order via Razorpay API
        const orderData = JSON.stringify({
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: 'INR',
            receipt: `pay_${student_id.toString().slice(0, 8)}_${Date.now()}`,
            notes: {
                student_id: student_id.toString(),
                course_id: course_id.toString(),
                source: 'pay-fee-subdomain'
            }
        });

        const order = await createRazorpayOrder(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, orderData);

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                key_id: RAZORPAY_KEY_ID // Public key - safe to send
            })
        };

    } catch (error) {
        console.error('Create order error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Failed to create order' })
        };
    }
};

// Helper: Create Razorpay Order via HTTPS
function createRazorpayOrder(keyId, keySecret, orderData) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        const options = {
            hostname: 'api.razorpay.com',
            port: 443,
            path: '/v1/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(orderData),
                'Authorization': `Basic ${auth}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(parsed.error?.description || 'Razorpay API error'));
                    }
                } catch (e) {
                    reject(new Error('Invalid response from Razorpay'));
                }
            });
        });

        req.on('error', reject);
        req.write(orderData);
        req.end();
    });
}
