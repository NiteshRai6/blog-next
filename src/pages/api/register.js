import { db } from "@/lib/db";
import bcrypt from 'bcrypt'

export default async function handler(req, res) {

    try {
        switch (req.method) {
            case 'POST':
                const name = req.body.name;
                const email = req.body.email;
                const mobile = req.body.mobile;
                const password = req.body.password;

                const checkUser = await db({
                    sql: 'SELECT * FROM users WHERE email = ?',
                    values: [email]
                });

                if (checkUser.length > 0) return res.status(409).json("User already exists!");

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                const register = await db({
                    sql: 'INSERT INTO users (name, email, mobile, password) VALUES (?,?,?,?)',
                    values: [name, email, mobile, hash]
                });

                if (register.affectedRows > 0) {
                    res.status(200).json('User Registered Successfully');
                }
                else {
                    res.status(403).json('Error in Registration!');
                }

                break;

            default:
                res.status(400).json('Method is not valid!');
        }
    } catch (error) {
        console.log(error)
        res.status(500).json("Server side Error!")
    }

}