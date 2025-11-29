
import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthStore } from "../../Chat/store/useAuthStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password = () => {
    const { actualizarPassword, authUser } = useAuthStore();
    const [password, setPassword] = useState(true)
    const [form, setForm] = useState({
        passwordactual: "",
        passwordnuevo: "",
        _id: authUser?._id || ""
    });

    const showPassword = () => {
        setPassword(!password)
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(form).includes("")) {
            toast.error("Todos los campos deben ser ingresados");
            return;
        }

        if (form.passwordnuevo.length < 6) {
            toast.error("El password debe tener mínimo 6 carácteres");
            return;
        }

        const resultado = await actualizarPassword(form);

        if (resultado.ok) {
            toast.success(resultado.msg);
            setForm({
                ...form,
                passwordactual: "",
                passwordnuevo: ""
            });
        } else {
            toast.error(resultado.msg);
        }
    };

    return (
        <>

            <div className='mt-5'>
                <h1 className='font-black text-4xl text-gray-500'>Password</h1>
                <hr className='my-4' />
                <p className='mb-2'>Este módulo te permite actualizar tu contraseña. Por seguridad, recuerda cambiarla cada 4 meses.</p>
            </div>
            <form onSubmit={handleSubmit}>

                <div>
                    <label
                        htmlFor='passwordactual'
                        className='text-gray-700 uppercase font-bold text-sm'>Contraseña actual: </label>
                    <input
                        id='passwordactual'
                        type={password ? "password" : "text"}
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='**************'
                        name='passwordactual'
                        value={form.passwordactual}
                        onChange={handleChange}
                    />
                    <span
                        className="px-2 cursor-pointer text-gray-500 hover:text-purple-700"
                        onClick={showPassword}
                    >
                        {password ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div>
                    <label
                        htmlFor='passwordnuevo'
                        className='text-gray-700 uppercase font-bold text-sm'>Nueva Contraseña: </label>
                    <input
                        id='passwordnuevo'
                        type={password ? "password" : "text"}
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='**************'
                        name='passwordnuevo'
                        value={form.passwordnuevo}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="submit"
                    className='bg-gray-800 w-full p-3 
        text-slate-300 uppercase font-bold rounded-lg 
        hover:bg-gray-600 cursor-pointer transition-all'
                    value='Actualizar' />
            </form>
        </>
    )
}

export default Password