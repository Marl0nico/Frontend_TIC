import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/Chat/store/useAuthStore";

export const Formulario = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion:"",
    tipo: "Carrera", // Default to "Carrera"
    carreraRelacionada:"",
    interesesRelacionados:[],
  });
  const {token, authUser} = useAuthStore();
  const [imagen, setImagen] = useState(null); // Estado para la imagen de logo
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleInteresesRelacionados = (e) => {
    const { value } = e.target;
    setForm({
      ...form,
      interesesRelacionados: value.split(",").map((item) => item.trim())
    });
  };
  const handleImageChange = (e) => {
    setImagen(e.target.files[0]); // Captura el archivo de imagen
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

    // Validar campos requeridos
    if (!form.nombre || !form.tipo || !imagen) {
      toast.error("El nombre, tipo de comunidad e imagen son obligatorios");
      return;
    }
    const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades`;
    const formData = new FormData();
    // Agregar imagen si existe
    if (imagen) {
      formData.append('logo', imagen);
    }
    // Agregar campos requeridos
    formData.append('nombre', form.nombre);
    formData.append('tipo', form.tipo);
    formData.append('descripcion', form.descripcion);
    formData.append('carreraRelacionada', form.carreraRelacionada);
    formData.append('administrador', administrador);

    // Convertir array a string para envío
    if (form.interesesRelacionados) {
      formData.append('interesesRelacionados', JSON.stringify(form.interesesRelacionados));
    }


    const respuesta = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
        },
      });
    toast.success(respuesta.data.msg);
    setForm({
      nombre: '',
      descripcion: '',
      tipo: '',
      carreraRelacionada: '',
      interesesRelacionados: []
    });
    setTimeout(() => {
    navigate('/dashboard/listar');
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="nombre"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Nombre:
        </label>
        <input
          id="nombre"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Ingrese el nombre de la comunidad"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="descripcion"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Descripción:
        </label>
        <textarea
          id="descripcion"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Ingrese la descripción de la comunidad"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-gray-700 uppercase font-bold text-sm">
          Logo:
        </label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
        />
      </div>

      <div>
        <label
          htmlFor="tipo"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Tipo:
        </label>
        <select
          id="tipo"
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
        <label
          htmlFor="carreraRelacionada"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Carrera Relacionada:
        </label>
        <input
          id="carreraRelacionada"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Ingrese la carrera relacionada"
          name="carreraRelacionada"
          value={form.carreraRelacionada}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="interesesRelacionados"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Intereses Relacionados (separados por comas):
        </label>
        <input
          id="interesesRelacionados"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Ingrese los intereses relacionados, separados por comas"
          value={form.interesesRelacionados.join(", ")}
          onChange={handleInteresesRelacionados}
        />
      </div>

      <input
        type="submit"
        className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
        value={"Registrar Comunidad"}
      />
    </form>
  );
};
