import { authenticator } from 'otplib';

const studioData = [
    {
        title: "ETITI",
        videos: [
            { name: "ETITI - Found Footage", id: "1n1ZkUOuLoUIaKLcFsMZvm7iG0y4Voh5u" },
            { name: "ETITI", id: "1Dr5kgLtsFRbuB9A6UGB7Lk1YrL4FdjYR" },
            { name: "ETITI 2", id: "1njGxRpyeGUu0bUiptg0oOhbIizznNqMC" }
        ]
    },
    {
        title: "Brain Damage",
        videos: [
            { name: "Brain Damage - Początek", id: "1UgKcI-keF-AqQp-payq0p321k9woB-JZ" },
            { name: "Brain Damage", id: "1gAtoFcu6NON8qhpwkPyhVOrw7P-KBV7S" }
        ]
    },
    {
        title: "Dokument",
        videos: [
            { name: "Dokument - Odc 1", id: "1s6ksDEfrIfdQ0qjj4Bj8hYkBf3aSe_ab" },
            { name: "Dokument - Odc 2", id: "11RxB_0jnXYSOhkZNssUCUI7HehMkoCgT" },
            { name: "Dokument - Odc 3", id: "1cG0Cuenn8Qw0inlnpV8pnN_WvJ2ZqTDa" },
            { name: "Dokument - Odc 4", id: "1hLZdM9zkGJmEEl7lHUVTTCOfGugaWuLT" },
            { name: "Dokument - Odc 5", id: "1DlGzlHr94VpjPQyDxgi3rt-ZfE2zNPaA" },
            { name: "Dokument - Odc 6", id: "1zVIQ8VTwd7IfxXhL6g0CpbKBStoR9VXk" }
        ]
    },
    {
        title: "Secrets of the Darkness",
        videos: [
            { name: "EP1 - Forgotten Caves", id: "1lhCgQ1y-NtjzmezqqaUITW51Idjz_2SH" },
            { name: "EP2 - Hopeless", id: "1djKMZYIlGapvaGODvRvniI8jBuJHg9K2" },
            { name: "EP3 - The truth", id: "19ScoD0U37AXNdrGxOQ_7-s9m1l2bbIZE" },
            { name: "EP4 - Tunnels", id: "1uP-dwfXgVOqLGrr9YIqDLHTXmneQEuf8" },
            { name: "EP5 ‐ Escape", id: "11-H5JVjeCzhSMi2E3FiJJQv7Penvxzlb" },
            { name: "EP6 - The Forest", id: "17Uc_l4EI1P-c5SonDJG07JMNuGiqtVJJ" },
            { name: "EP7 - Mountains", id: "17PPziA3slHzCIO1-NATeTEMncOO53J1S" },
            { name: "trapped", id: "1uS6BPrVj7ChQJC_XeyOnHCrIzDYIO1hi" }
        ]
    },
    {
        title: "The Backrooms",
        videos: [
            { name: "The Backrooms", id: "1qhnH7bT0EYMlPT8ZFQ-k389pWjFojMHQ" },
            { name: "The Backrooms Level 3 (Found Footage)", id: "1CpClXm3qf4Mc2y5h9rl1vmC1xnPnlxnf" }
        ]
    },
    {
        title: "Zmora Sztucznej Inteligencji - SE1",
        videos: [
            { name: "EP1 - Be rickrolled", id: "1zGbjv9zDEf77vCURKbyixddUkMsjzMJ0" },
            { name: "EP2 - Fire in the hole chain", id: "1Mudt6IdGA95ZmFLjq2pQcqcDHfD8llCI" },
            { name: "EP3 - Pennywise is rickrolled", id: "1CRzx4RZ4ZcH6ax_ZMTWWlqD6brl9CDF9" },
            { name: "EP4 - De end", id: "1Po0bv-tFiw-fNcTabQXlXVfnKcS3aZxd" }
        ]
    },
    {
        title: "Zmora Sztucznej Inteligencji - SE2",
        videos: [
            { name: "EP1 - Meat", id: "1uvvtsInnFuQV0ByzLhKioRMYRKY7LrRD" },
            { name: "EP2 - Get some fish", id: "1LIrt0vf0xOkC1gOa5m1tSpTChGMjyIqx" },
            { name: "EP3 - Spuki", id: "121ftVbseagEPpDrV8yzQNk59A1dKS2f_" }
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
