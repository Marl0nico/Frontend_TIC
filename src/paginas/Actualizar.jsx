import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuthStore } from '../Chat/store/useAuthStore';

const Actualizar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, authUser } = useAuthStore();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'Carrera',
    carreraRelacionada: '',
    interesesRelacionados: []
  });

  const [imagen, setImagen] = useState(null);

  // 🔹 Cargar datos actuales de la comunidad
  useEffect(() => {
    const fetchComunidad = async () => {
      try {
        if (!token) {
          toast.error("No hay token de autorización");
          return;
        }

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comunidades/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          tipo: data.tipo || 'Carrera',
          carreraRelacionada: data.carreraRelacionada || '',
          interesesRelacionados: data.interesesRelacionados || []
        });

      } catch (error) {
        toast.error("Error al cargar la comunidad");
        console.error(error);
      }
    };

    fetchComunidad();
  }, [id,token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleInteresesRelacionados = (e) => {
    setForm({ ...form, interesesRelacionados: e.target.value.split(',').map(item => item.trim()) });
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        toast.error("No hay token de autorización");
        return;
      }

      const administrador = authUser?._id;
      if (!administrador) {
        toast.error("No se encontró el administrador. Inicie sesión nuevamente.");
        return;
      }

      // Validación básica
      if (!form.nombre || !form.tipo) {
        toast.error("El nombre y tipo de comunidad son obligatorios");
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades/${id}`;
      const formData = new FormData();

      if (imagen) {
        formData.append('logo', imagen);
      }
      formData.append('nombre', form.nombre);
      formData.append('tipo', form.tipo);
      formData.append('descripcion', form.descripcion);
      formData.append('carreraRelacionada', form.carreraRelacionada);
      formData.append('administrador', administrador);
      formData.append('interesesRelacionados', JSON.stringify(form.interesesRelacionados));

      const respuesta = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        },
      });

      toast.success(respuesta.data.msg);
      navigate('/dashboard/listar');

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la comunidad");
    }
  };

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Actualizar Comunidad</h1>
      <hr className="my-4" />
      <p className="mb-8">Este módulo te permite actualizar los datos de una comunidad registrada</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Nombre:</label>
          <input
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="Ingrese el nombre de la comunidad"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Descripción:</label>
          <textarea
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="Ingrese la descripción de la comunidad"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Logo:</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          />
        </div>

        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Tipo:</label>
          <select
            name="tipo"
            className="border-2 w-full p-2 mt-2 rounded-md mb-5"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="Carrera">Carrera</option>
            <option value="Intereses">Intereses</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Carrera Relacionada:</label>
          <input
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="Ingrese la carrera relacionada"
            name="carreraRelacionada"
            value={form.carreraRelacionada}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-700 uppercase font-bold text-sm">Intereses Relacionados:</label>
          <input
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="Ingrese los intereses separados por comas"
            value={form.interesesRelacionados.join(', ')}
            onChange={handleInteresesRelacionados}
          />
        </div>

        <input
          type="submit"
          className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
          value="Actualizar Comunidad"
        />
      </form>
    </div>
  );
};

export default Actualizar;