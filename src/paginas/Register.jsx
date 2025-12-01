import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEyeSlash, FaEye } from 'react-icons/fa'

export const Register = () => {
  const [password, setPassword] = useState(true)
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    celular: "",
    universidad: "",
    carrera: "",
    bio: "",
    intereses: "",
    comunidad: "",
  });

  const [imagen, setImagen] = useState(null); // Estado para la imagen de perfil

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]); // Captura el archivo de imagen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/registro`;
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Agregar la imagen de perfil al FormData
      if (imagen) {
        formData.append("fotoPerfil", imagen);
      }

      const respuesta = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(respuesta.data.msg);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al registrar al estudiante");
    }
  };

  const showPassword = () => {
    setPassword(!password)
  }


  return (
    <>

      <div className="bg-white flex justify-center items-start w-1/2 overflow-auto">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
            Crea tu cuenta
          </h1>
          <small className="text-gray-400 block my-4 text-sm">
            Por favor llena los siguientes campos
          </small>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Nombre Completo</label>
              <input
                name="nombre"
                value={form.nombre || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: Juan Perez"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Nombre de Usuario</label>
              <input
                name="usuario"
                value={form.usuario || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: juanperez"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                type="email"
                placeholder="ej: juan@gmail.com"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Contraseña</label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:border-purple-700 focus-within:ring-1 focus-within:ring-purple-700">
                <input
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  type={password ? "password" : "text"}
                  placeholder="********"
                  className="flex-1 py-1 px-2 text-gray-500 outline-none"
                />
                <span
                  onClick={showPassword}
                  className="cursor-pointer px-2 text-gray-600"
                >
                  {password ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Celular</label>
              <input
                name="celular"
                value={form.celular || ""}
                onChange={handleChange}
                type="tel"
                placeholder="ej: 1234567890"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Universidad</label>
              <select
                name="universidad"
                value={form.universidad || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
              >
                <option value="">Seleccionar</option>
                <option value="EPN">Escuela Politécnica Nacional</option>
                <option value="UPS">Universidad Politécnica Salesiana</option>
                <option value="PUCE">Pontificia Universidad Católica del Ecuador</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Carrera</label>
              <select
                name="carrera"
                value={form.carrera || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
              >
                <option value="">Seleccionar carrera</option>

                <optgroup label="EPN - ESFOT">
                  <option value="Tecnología Superior en Agua y Saneamiento Ambiental">Tecnología Superior en Agua y Saneamiento Ambiental</option>
                  <option value="Tecnología Superior en Redes y Telecomunicaciones">Tecnología Superior en Redes y Telecomunicaciones</option>
                  <option value="Tecnología Superior en Desarrollo de Software">Tecnología Superior en Desarrollo de Software</option>
                  <option value="Tecnología Superior en Electromecánica">Tecnología Superior en Electromecánica</option>
                  <option value="Tecnología Superior en Procesamiento de Alimentos">Tecnología Superior en Procesamiento de Alimentos</option>
                  <option value="Tecnología Superior en Procesamiento Industrial de la Madera">Tecnología Superior en Procesamiento Industrial de la Madera</option>
                </optgroup>
                <optgroup label="EPN">
                  <option value="Ingeniería Civil">Ingeniería Civil</option>
                  <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                  <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                  <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
                  <option value="Ingeniería Ambiental">Ingeniería Ambiental</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                </optgroup>

                <optgroup label="UPS">
                  <option value="Ingeniería de Software">Ingeniería de Software</option>
                  <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Ciencias de la Educación">Ciencias de la Educación</option>
                  <option value="Administración de Empresas">Administración de Empresas</option>
                </optgroup>

                <optgroup label="PUCE">
                  <option value="Medicina">Medicina</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                  <option value="Comunicación Social">Comunicación Social</option>
                </optgroup>
              </select>
            </div>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Foto de Perfil</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-500 file:text-slate-300 hover:file:cursor-pointer hover:file:bg-gray-900 hover:file:text-white"
              />
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white"
              >
                Registrarse
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>Ya tienes cuenta?</p>
            <Link
              to="/login"
              className="py-2 px-5 bg-gray-500 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div
        className="w-1/2 h-screen bg-[url('/images/register.webp')] 
            bg-no-repeat bg-cover bg-center sm:block hidden"
      ></div>
    </>
  );
};

export default Register;
