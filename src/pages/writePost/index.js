import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});


const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }],
        ["link"],
        ["clean"],
        [{ color: [] }, { background: [] }],
        // [{ cards: [] }],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};


export default function WritePost() {

    const navigate = useRouter();

    const [post, setPost] = useState({
        post_title: "",
        post_img: "",
        post_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        user_id: ''
    })

    const [post_des, setPost_des] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setPost((pre) => {
            return { ...pre, user_id: user?.user_id }
        })
    }, []);

    const handleChange = (e) => {
        e.preventDefault();

        const inputValue = e.target.type === "file"
            ? e.target.files[0]
            : e.target.value;

        setPost(prev => {
            return { ...prev, [e.target.name]: inputValue }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('post_title', post.post_title);
            formData.append('post_des', post_des);
            formData.append('post_img', post.post_img);
            formData.append('post_date', post.post_date);
            formData.append('user_id', post.user_id);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/post`,
                formData, { withCredentials: true });

            navigate.push('/');
            // console.log(res.data);
            return res.data;

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className=''>
            <Navbar />

            <div className='grid justify-center items-center'>

                <div className='grid gap-5 bg-[#3cb371] p-10 my-5'>

                    <h1 className='text-white text-3xl'>Create Post</h1>

                    <div className='grid gap-5'>

                        <input className='p-2 text-lg' required type='text' name='post_title' placeholder='Post Title' onChange={handleChange} />

                        <div className='bg-white'>

                            <ReactQuill className='ql-cards' theme="snow" name='post_des' placeholder='Description'
                                onChange={(value) =>
                                    setPost_des(value)
                                }
                                modules={modules}
                            />

                        </div>

                        <input className='p-2 text-lg' required type='file' name='post_img' onChange={handleChange} />

                        <button onClick={handleSubmit} className='p-2 text-lg bg-[#6a5acd] text-white hover:bg-[#ee82ee] hover:text-[#6a5acd]'>Submit</button>

                    </div>
                </div>
            </div>
        </div>
    )
}
