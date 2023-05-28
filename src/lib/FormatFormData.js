import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

const FormatFormData = async (req, { saveLocally, uploadPath, multiples = false }) => {
    try {
        saveLocally && (await fs.readdir(uploadPath));
    } catch (error) {
        await fs.mkdir(uploadPath, { recursive: true });
    }

    const options = {};
    if (saveLocally) {
        options.uploadDir = uploadPath;
        options.filename = (name, _, path, form) => {
            const ext = path.mimetype.split("/")[1];
            return `${uuidv4()}.${ext}`;
        };
        options.filter = ({ name, originalFilename, mimetype }) => {
            return mimetype && (mimetype.includes("jpeg") || mimetype.includes("png") || mimetype.includes("jpg"));
        };
    }
    const form = formidable({ ...options, multiples });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);

            try {
                const fieldcol = Object.keys(fields)[0];
                const fileKeyName = Object.keys(files);
                const filesLength = Array.isArray(fileKeyName) ? files[fileKeyName[0]]?.length : fileKeyName?.length;

                if (saveLocally && filesLength <= Array.isArray(fields[fieldcol]) ? fields[fieldcol]?.length : 0)
                    throw new Error("Unsupported file or image extension.")
            } catch (error) {
                reject(error)
            }
            resolve({ fields, files })
        });
    });
};

export default FormatFormData;
