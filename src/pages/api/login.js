import { db } from "@/lib/db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {

    try {
        switch (req.method) {
            case 'POST':
                const email = req.body.email;
                const password = req.body.password;

                const login = await db({
                    sql: 'SELECT * FROM users WHERE email = ?',
                    values: [email]
                });

                if (login.length === 0) return res.status(404).json("User not found!");

                const isPasswordCorrect = bcrypt.compareSync(password, login[0].password);

                if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

                const token = jwt.sign({ user_id: login[0].user_id }, process.env.JWT_KEY, {
                    expiresIn: '24h'
                });

                res.setHeader("Set-Cookie",
                    cookie.serialize('jwt', token, {
                        httpOnly: true,
                        sameSite: process.env.PRODUCTION == 1 ? true : false,
                        path: '/',
                    })
                );

                delete login[0].password;
                res.status(200).json(login);

                break;

            default:
                res.status(400).json('Method is not valid!');
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Server side Error!")
    }

}