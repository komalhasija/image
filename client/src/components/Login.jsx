import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const Login = () => {
    const [state, setState] = useState('Login');
    const { setShowLogin, backendUrl, setToken,setUser } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Login') {
                const res = await axios.post(backendUrl + 'api/user/login',
                    { email, password })

                if (res.data.success) {
                    setToken(res.data.Token)
                    setUser(res.data.user)
                    localStorage.setItem('token', res.data.token)
                    setShowLogin(false)
                }
                else {
                    toast.error(res.data.message);
                }
            }
            else {
                const res = await axios.post(backendUrl + 'api/user/register',
                    { name, email, password })

                if (res.data.success) {
                    setToken(res.data.Token)
                    setUser(res.data.user)
                    localStorage.setItem('token', res.data.token)
                    setShowLogin(false)
                }
                else {
                    toast.error(res.data.message);
                }

            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])
    return (
        <div className='fixed absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to Continue</p>
                {state != 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.user_icon} alt="" className='text-sm' />
                    <input type="text" placeholder='Full Name' onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' required />
                </div>}


                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.email_icon} alt="" />
                    <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' required />
                </div>

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.lock_icon} alt="" />
                    <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' required />
                </div>
                <p className=' text-sm my-5 text-blue-500 cursor-pointer'>Forgot Password?</p>
                <button className='bg-blue-500 w-full text-white py-2 rounded-full'>{state === 'Login'?'Login':'Create Account'}</button>
                {state === 'Login' && <p className='mt-5 text-center'>Don't have an account?<span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign Up</span> </p>}
                {state !== 'Login' && <p className='mt-5 text-center'>Already have an account?<span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span> </p>}
                <img src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' onClick={() => setShowLogin(false)} />
            </form>
        </div>
    )
}

export default Login