import { authenticator } from 'otplib';

const studioData = [
    {
        title: "Dokument",
        videos: [
            { name: "Dokument - Part 1", id: "1s6ksDEfrIfdQ0qjj4Bj8hYkBf3aSe_ab" },
            { name: "Dokument - Part 2", id: "11RxB_0jnXYSOhkZNssUCUI7HehMkoCgT" },
            { name: "Dokument - Part 3", id: "1cG0Cuenn8Qw0inlnpV8pnN_WvJ2ZqTDa" },
            { name: "Dokument - Part 4", id: "1hLZdM9zkGJmEEl7lHUVTTCOfGugaWuLT" },
            { name: "Dokument - Part 5", id: "1DlGzlHr94VpjPQyDxgi3rt-ZfE2zNPaA" },
            { name: "Dokument - Part 6", id: "1zVIQ8VTwd7IfxXhL6g0CpbKBStoR9VXk" }
        ]
    },
    {
        title: "The Backrooms",
        videos: [
            { name: "The Backrooms - Part 1", id: "1qhnH7bT0EYMlPT8ZFQ-k389pWjFojMHQ" },
            { name: "The Backrooms - Part 2", id: "1CpClXm3qf4Mc2y5h9rl1vmC1xnPnlxnf" }
        ]
    },
    {
        title: "Zmora Sztucznej Inteligencji - SE1",
        videos: [
            { name: "SE1 - Episode 1", id: "1zGbjv9zDEf77vCURKbyixddUkMsjzMJ0" },
            { name: "SE1 - Episode 2", id: "1Mudt6IdGA95ZmFLjq2pQcqcDHfD8llCI" },
            { name: "SE1 - Episode 3", id: "1CRzx4RZ4ZcH6ax_ZMTWWlqD6brl9CDF9" },
            { name: "SE1 - Episode 4", id: "1Po0bv-tFiw-fNcTabQXlXVfnKcS3aZxd" }
        ]
    },
    {
        title: "Zmora Sztucznej Inteligencji - SE2",
        videos: [
            { name: "SE2 - Episode 1", id: "1uvvtsInnFuQV0ByzLhKioRMYRKY7LrRD" },
            { name: "SE2 - Episode 2", id: "1LIrt0vf0xOkC1gOa5m1tSpTChGMjyIqx" },
            { name: "SE2 - Episode 3", id: "121ftVbseagEPpDrV8yzQNk59A1dKS2f_" }
        ]
    }
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { token } = req.body || {};
    const secret = process.env.TOTP_SECRET;

    if (!secret) {
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }

    try {
        const isValid = authenticator.check(token, secret);

        if (isValid) {
            return res.status(200).json({
                success: true,
                data: studioData
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid code. Please try again.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error verifying token'
        });
    }
}
