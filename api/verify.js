const crypto = require('crypto');

function base32ToBuffer(base32) {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.toUpperCase().charAt(i));
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    const bytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
    }
    return Buffer.from(bytes);
}

function verifyTOTP(token, secretBase32) {
    const secretBytes = base32ToBuffer(secretBase32);
    const epoch = Math.floor(Date.now() / 1000);
    
    for (let drift = -1; drift <= 1; drift++) {
        const timeStep = Math.floor(epoch / 30) + drift;
        const timeBuffer = Buffer.alloc(8);
        timeBuffer.writeUInt32BE(0, 0);
        timeBuffer.writeUInt32BE(timeStep, 4);

        const hmac = crypto.createHmac('sha1', secretBytes).update(timeBuffer).digest();
        const offset = hmac[hmac.length - 1] & 0xf;
        const code = ((hmac[offset] & 0x7f) << 24 |
                      (hmac[offset + 1] & 0xff) << 16 |
                      (hmac[offset + 2] & 0xff) << 8 |
                      (hmac[offset + 3] & 0xff)) % 1000000;

        if (code.toString().padStart(6, '0') === token.trim()) {
            return true;
        }
    }
    return false;
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body || {};
    if (!code) {
        return res.status(400).json({ error: 'Missing code' });
    }

    const secret = process.env.TOTP_SECRET;
    if (!secret) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (verifyTOTP(code, secret)) {
        const studioData = [
            {
                title: "ETITI 🇵🇱",
                videos: [
                    { name: "ETITI (Found Footage)", id: "1n1ZkUOuLoUIaKLcFsMZvm7iG0y4Voh5u" },
                    { name: "ETITI", id: "1Dr5kgLtsFRbuB9A6UGB7Lk1YrL4FdjYR" },
                    { name: "ETITI 2", id: "1njGxRpyeGUu0bUiptg0oOhbIizznNqMC" }
                ]
            },
            {
                title: "Secrets of the Darkness 🇺🇸",
                videos: [
                    { name: "EP1 - Forgotten Caves", id: "1GVzd-GXPO3WgGtBqlWFZ9jsvXcdaP9UN" },
                    { name: "EP2 - Hopeless", id: "1Z1ccd-2NE8IXtz4DKIZlQV6no72uPFgT" },
                    { name: "EP3 - The truth", id: "1CaiSgPsqgLjfflXEvx4FjcsGLScn-Xk2" },
                    { name: "EP4 - Tunnels", id: "1CxdouuGTDPyMTt9o6AMwSYMGuHbw1_jr" },
                    { name: "EP5 - Escape", id: "1Uovz5vRRU-MYSM3B6aQpetB291k2hClh" },
                    { name: "EP6 - The Forest", id: "1lVxXdnOVyv3J0zyZ7lSk2GPEltK-GqI0" },
                    { name: "EP7 - Mountains", id: "1Ntiox0fHpOjOgVBa94qvtSXUTZ9ETCdZ" },
                    { name: "trapped", id: "1_anOCwEiJUetOuBIG2vjkoOgIuyKmWpA" }
                ]
            },
            {
                title: "Brain Damage 🇵🇱",
                videos: [
                    { name: "Brain Damage - Początek", id: "1UgKcI-keF-AqQp-payq0p321k9woB-JZ" },
                    { name: "Brain Damage", id: "1gAtoFcu6NON8qhpwkPyhVOrw7P-KBV7S" }
                ]
            },
            {
                title: "DOKUMENT 🇵🇱",
                videos: [
                    { name: "DOKUMENT 1", id: "1xR5a3lW3V0O1H0d7Jb1aQ_v4N2x5B1k9" }
                ]
            },
            {
                title: "The Backrooms 🇺🇸",
                videos: [
                    { name: "The Backrooms - Found Footage", id: "1aB2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" }
                ]
            },
            {
                title: "Zmora Sztucznej Inteligencji 🇵🇱",
                videos: [
                    { name: "Zmora Sztucznej Inteligencji - Zwiastun", id: "1z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5" }
                ]
            }
        ];
        return res.status(200).json({ success: true, data: studioData });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid code' });
    }
}
