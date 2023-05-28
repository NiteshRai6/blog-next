import { db } from "@/lib/db";
import FormatFormData from "@/lib/FormatFormData";
import path from "path";
import jwt from 'jsonwebtoken';

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {

    const COMMON_UPLOAD_PATH = "/public/uploads";

    try {
        switch (req.method) {
            case 'POST':
                const token = req.cookies.jwt;
                const { user_id } = jwt.verify(token, process.env.JWT_KEY);
                if (!token) return res.status(401).json('Not Authenticated');

                const { fields, files } = await FormatFormData(req, {
                    saveLocally: true,
                    uploadPath: path.join(process.cwd() || process.env.ROOT_DIR, COMMON_UPLOAD_PATH, "/posts"),
                    multiples: true
                })

                const { post_title, post_des, post_date } = fields;

                const post_img = files.post_img.newFilename;

                const post = await db({
                    sql: 'INSERT INTO post (post_title, post_des, post_img, post_date, user_id) VALUES (?,?,?,?,?)',
                    values: [post_title, post_des, post_img, post_date, user_id]
                });

                if (post.affectedRows > 0) {
                    res.status(200).json('Post Successful');
                }
                else {
                    res.status(403).json('Error in Post!');
                }

                break;

            case 'GET':
                const getPost = await db({

                    sql: "SELECT post_id, post_title, post_des, post_img, post_date, users.user_id, post.user_id, name FROM users JOIN post ON users.user_id = post.user_id",
                    values: []
                })

                if (getPost.length > 0) {
                    res.status(200).json(getPost);
                }
                else {
                    res.status(403).json('Error in getting Post!');
                }

                break;

            default:
                res.status(400).json('Method is not valid');
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Server side Error!")
    }

}