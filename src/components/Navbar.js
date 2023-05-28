import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaFacebookF } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [user, setUser] = useState();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const navigate = useRouter();

    const logout = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/logout`);
            localStorage.clear();
            navigate.reload('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='grid grid-flow-col h-20 w-[100vw] bg-[#3b5998] text-white font-[500]
        items-center justify-around z-10 sticky top-0'>

            <div className='text-4xl hover:text-[magenta] transform 
                         hover:rotate-[360deg] transition duration-700 ease-in-out'>
                <Link href='/'>
                    <FaFacebookF />
                </Link>
            </div>

            <ul className='grid grid-flow-col lg:gap-8 gap-5 text-xl items-center'>

                {user ?
                    <li className='text-2xl hover:text-[magenta] transform 
                         hover:rotate-[360deg] transition duration-700 ease-in-out'>
                        <Link href='/writePost'>
                            <IoMdCreate />
                        </Link>
                    </li>
                    :
                    <li></li>
                }

                <li className='hover:text-[magenta]'>
                    <Link href='/'>Home</Link>
                </li>

                {user?.name ?

                    <li>
                        <span className='text-[pink]'> {user?.name} </span>
                        <span className='cursor-pointer hover:text-[magenta]' onClick={logout}> Logout </span>
                    </li>
                    :
                    <li> <Link href='/login'>Login</Link> </li>
                }

                {!user ?
                    <li className='hover:text-[magenta]'>
                        <Link href='/register'>Register</Link>
                    </li>
                    :
                    <li></li>
                }

            </ul>

        </div>
    )
}
