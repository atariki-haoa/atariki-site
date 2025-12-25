import { NextApiRequest, NextApiResponse } from "next";
import csrf from 'csrf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const csrfProtection = new csrf();
    const csrfToken = csrfProtection.create(process.env.CSRF_SECRET as string);
    res.status(200).json({ csrfToken });
}