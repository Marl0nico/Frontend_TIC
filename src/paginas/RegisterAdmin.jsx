import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const RegisterAdmin = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
            const respuesta = axios.post(url, form)
            const json = await respuesta
            toast.success(json.data.msg)
        } catch (error) {
            console.error(error)
            toast.error(error.response.data.msg)
        }
    }

  return (
    <>
      
      <form onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor='nombre'
                    className='text-gray-700 uppercase font-bold text-sm'>Nombre: </label>
                <input
                    id='nombre'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='ej: Juan'
                    name='nombre'
                    value={form.nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='apellido:'
                    className='text-gray-700 uppercase font-bold text-sm'>Apellido: </label>
                <input
                    id='apellido'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='ej: Perez'
                    name='apellido'
                    value={form.apellido}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='email'
                    className='text-gray-700 uppercase font-bold text-sm'>Email: </label>
                <input
                    id='email'
                    type="email"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='ej: juan@gmail.com'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='password'
                    className='text-gray-700 uppercase font-bold text-sm'>Password: </label>
                <input
                    id='password'
                    type="password"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='********'
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='telefono'
                    className='text-gray-700 uppercase font-bold text-sm'>Telefono: </label>
                <input
                    id='telefono'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='ej: 0999999999'
                    name='telefono'
                    value={form.telefono}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='direccion:'
                    className='text-gray-700 uppercase font-bold text-sm'>Direccion: </label>
                <input
                    id='direccion'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='ej: Av. 9 de Octubre'
                    name='direccion'
                    value={form.direccion}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className='bg-gray-600 w-full p-3 
                    text-slate-300 uppercase font-bold rounded-lg 
                    hover:bg-gray-900 cursor-pointer transition-all'
                    value={'Registrar Admin'} />

        </form>
    </>
  );
};

export default RegisterAdmin;