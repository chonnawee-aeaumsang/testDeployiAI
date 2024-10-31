export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { log, data } = req.body;

        // Log the received data to Vercel's server logs
        console.log(`[Log Message]: ${log}`);
        console.log(`[Data Payload]: ${JSON.stringify(data, null, 2)}`);

        res.status(200).json({ status: 'success', message: 'Log received' });
    } else {
        res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }
}