import cookie from "cookie"

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") return res.status(500).json({ message: "Method not allowed" })

        res.setHeader("Set-Cookie",
            cookie.serialize('jwt', '', {
                httpOnly: true,
                sameSite: process.env.PRODUCTION == 1 ? true : false,
                path: '/',
            })
        );
        res.json({ message: "Success" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}