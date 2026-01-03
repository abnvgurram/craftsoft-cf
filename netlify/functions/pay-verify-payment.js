// Pay Subdomain - Verify Razorpay Payment
// Netlify Serverless Function
// POST /.netlify/functions/pay-verify-payment

const https = require('https');
const crypto = require('crypto');

// Razorpay credentials for Pay subdomain
const RAZORPAY_KEY_SECRET = 'PG3yS8CinpQXyLVq49aCiJVx';

// Supabase config
const SUPABASE_URL = 'https://afocbygdakyqtmmrjvmy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            student_id,
            course_id
        } = JSON.parse(event.body);

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing payment details' })
            };
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid payment signature' })
            };
        }

        // Fetch payment details from Razorpay
        const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);
        const amountPaid = paymentDetails.amount / 100; // Convert paise to rupees

        // Record payment in Supabase
        const receiptId = `RCP-${Date.now()}`;

        if (SUPABASE_SERVICE_KEY) {
            await recordPayment({
                student_id,
                course_id,
                amount_paid: amountPaid,
                payment_method: 'UPI',
                razorpay_payment_id,
                razorpay_order_id,
                receipt_id: receiptId,
                status: 'completed'
            });
        }

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                receipt_id: receiptId,
                amount_paid: amountPaid,
                payment_id: razorpay_payment_id
            })
        };

    } catch (error) {
        console.error('Verify payment error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Payment verification failed' })
        };
    }
};

// Fetch payment details from Razorpay
function fetchPaymentDetails(paymentId) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`rzp_test_RzG65cnAOq1VuF:${RAZORPAY_KEY_SECRET}`).toString('base64');

        const options = {
            hostname: 'api.razorpay.com',
            port: 443,
            path: `/v1/payments/${paymentId}`,
            method: 'GET',
            headers: {
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
                        reject(new Error(parsed.error?.description || 'Failed to fetch payment'));
                    }
                } catch (e) {
                    reject(new Error('Invalid response from Razorpay'));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// Record payment in Supabase
async function recordPayment(paymentData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(paymentData);

        const options = {
            hostname: 'afocbygdakyqtmmrjvmy.supabase.co',
            port: 443,
            path: '/rest/v1/payments',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    console.error('Supabase error:', data);
                    // Don't reject - payment was successful, just log failed
                    resolve();
                }
            });
        });

        req.on('error', (err) => {
            console.error('Supabase request error:', err);
            resolve(); // Don't fail the whole payment
        });

        req.write(postData);
        req.end();
    });
}
