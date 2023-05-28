import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {

    const [error, setError] = useState(false);

    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    const navigate = useRouter();

    const handleChange = (e) => {
        setInputs((pre) => ({
            ...pre, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/register`, inputs);
            navigate.push('/login');
            console.log(res.data);

        } catch (error) {
            setError(error?.response?.data);
            console.log(error);
        }
    }

    return (
        <div className=''>

            <div className='grid justify-center items-center'>

                <div className='grid gap-5 bg-[#3cb371] py-10 px-20 mt-20'>

                    <h1 className='text-white text-3xl'>Register</h1>

                    {error && <h2 className='text-[#720f0f] text-lg font-bold'>{error}</h2>}

                    <form className='grid gap-5'>

                        <input className='p-2 text-lg' required type='text' name='name' placeholder='Name' onChange={handleChange} />

                        <input className='p-2 text-lg' required type='email' name='email' placeholder='Email' onChange={handleChange} />

                        <input className='p-2 text-lg' required type='number' name='mobile' placeholder='Mobile' onChange={handleChange} />

                        <input className='p-2 text-lg' required type='password' name='password' placeholder='Password' onChange={handleChange} />

                        <button onClick={handleSubmit} className='p-2 text-lg bg-[#6a5acd] text-white hover:bg-[#ee82ee] hover:text-[#6a5acd]'>Submit</button>

                        <div className='text-white'>Do You Have An Account ?
                            <Link className='pl-2 text-[#0000ff] hover:text-[#ffa500]'
                                href='/login'>Login</Link>
                        </div>

                        <div className='text-white'>Are you Guest ?
                            <Link className='pl-2 text-[#0000ff] hover:text-[#ffa500]'
                                href='/'>Home</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
