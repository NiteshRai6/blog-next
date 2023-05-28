import { db } from "@/lib/db";
import jwt from 'jsonwebtoken';
import FormatFormData from "@/lib/FormatFormData";
import path from "path";

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {

    const COMMON_UPLOAD_PATH = "/public/uploads";

    const { post_id } = req.query
    try {
        switch (req.method) {

            case 'GET':

                const getPost = await db({
                    sql: 'SELECT * FROM post WHERE post_id = ?',
                    values: [post_id]
                })

                // console.log(getPost)

                if (getPost.length > 0) {
                    res.status(200).json(getPost);
                }
                else {
                    res.status(403).json('Error in getting Post!');
                }
                break;

            case 'PUT':
                const token2 = req.cookies.jwt;
                const { user_id: user_id2 } = jwt.verify(token2, process.env.JWT_KEY);
                if (!token2) return res.status(401).json('Not Authenticated');


                // console.log(req.body);

                const { fields, files } = await FormatFormData(req, {
                    saveLocally: true,
                    uploadPath: path.join(process.cwd() || process.env.ROOT_DIR, COMMON_UPLOAD_PATH, "/posts"),
                    multiples: true
                })

                const { post_title, post_des } = fields;

                const post_img = files.post_img.newFilename;

                const updatePost = await db({
                    sql: 'UPDATE post SET post_title = ?, post_des = ?, post_img = ? WHERE post_id = ? AND user_id = ?',
                    values: [post_title, post_des, post_img, post_id, user_id2]
                })

                if (updatePost.affectedRows > 0) {
                    res.status(200).json('Post Deleted Successfully');
                }
                else {
                    res.status(403).json('Error in getting Post!');
                }
                break;

            case 'DELETE':
                const token = req.cookies.jwt;
                const { user_id } = jwt.verify(token, process.env.JWT_KEY);
                if (!token) return res.status(401).json('Not Authenticated');

                const deletePost = await db({
                    sql: 'DELETE FROM post WHERE post_id = ? AND user_id = ? ',
                    values: [post_id, user_id]
                })

                if (deletePost.affectedRows > 0) {
                    res.status(200).json('Post Deleted Successfully');
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
