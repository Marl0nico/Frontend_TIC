import axios from 'axios'
import {Link, useParams} from 'react-router-dom'
import { useEffect } from 'react'
import toast from "react-hot-toast";


export const Confirmar = () => {
    const {token} = useParams()
    const verifyToken = async () =>{
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/estudiante/confirmar/${token}`
            const respuesta = await axios.get(url)
            toast.success(respuesta.data.msg)
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.msg || "Error al confirmar tu email")
        }
    }
    
    useEffect(() => {
      verifyToken()
    }, [])
    
    return (
        <div className="flex flex-col items-center justify-center">

            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src='/images/icons8-received-96.png' alt="email confirmation"/>

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Ya puedes iniciar sesión</p>
                <Link to="/login" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Login</Link>
            </div>
            
        </div>
    )
}
