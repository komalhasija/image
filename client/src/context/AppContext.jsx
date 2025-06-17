import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { data, useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const navigate=useNavigate();
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token,setToken]=useState(localStorage.getItem('token'))



    const [credits,setCredit]=useState(false);

    const logout=()=>{
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }

 
    const backendUrl = "https://image-gkxi.onrender.com/";
    const loadCreditsData=async()=>{
        try {
            const res=await axios.get(backendUrl+'api/user/credits',{
                headers:{token}
            })
            console.log(res);
            if (res.data.success) {
                setCredit(res.data.credits);
                setUser(res.data.user);
                console.log(credits);
            }
            else{
                toast.error(res.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const generateImage=async(prompt)=>{
        try {
            const res=await axios.post(backendUrl+'api/image/generate-image',{
                prompt
            },{headers:{token}})
            

            if(res.data.success){
                
               loadCreditsData()
                return res.data.resultImage
            }
            else{
                toast.error(res.data.message);
                loadCreditsData()
                if(res.data.creditBalance === 0){
                    navigate('/buy')
                }
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    useEffect(()=>{
        if(token){
            loadCreditsData()
        }
    },[token])
    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl,token,setToken,credits,setCredit,loadCreditsData,logout,generateImage
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;
