import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../Chat/store/useAuthStore";

export const PerfilEstudiante = () => {
  const { id } = useParams(); // Obtener el ID del estudiante de la URL
  const [estudiante, setEstudiante] = useState(null); // Estado para guardar los datos del estudiante
  const {token} = useAuthStore()
  const navigate = useNavigate();
  const consultarEstudiante = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/${id}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setEstudiante(respuesta.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos del estudiante");
    }
  }, [id]);
  
  useEffect(() => {
    consultarEstudiante();
  }, [consultarEstudiante]);

  // Si los datos del estudiante no han llegado, mostramos un loading o mensaje
  if (!estudiante) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-white border border-slate-200 h-auto p-4 
                    flex flex-col items-start justify-between shadow-xl rounded-lg min-w-[300px] flex-grow max-w-full">

      <div className="self-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
        >
          Volver
        </button>
        <img 
          src={estudiante.fotoPerfil?.url || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"} 
          alt="img-client" 
          className="m-auto rounded-3xl" 
          width={120} 
          height={120} 
        />
      </div>
      <div className="self-start mb-2">
        <b>Nombre:</b><p className="inline-block ml-3">{estudiante.nombre}</p>
      </div>
      <div className="self-start mb-2">
        <b>Usuario:</b><p className="inline-block ml-3">{estudiante.usuario}</p>
      </div>
      <div className="self-start mb-2">
        <b>Email:</b><p className="inline-block ml-3">{estudiante.email}</p>
      </div>
      <div className="self-start mb-2">
        <b>Universidad:</b><p className="inline-block ml-3">{estudiante.universidad}</p>
      </div>
      <div className="self-start mb-2">
        <b>Celular:</b><p className="inline-block ml-3">{estudiante.celular}</p>
      </div>
      <div className="self-start mb-2">
        <b>Carrera:</b><p className="inline-block ml-3">{estudiante.carrera}</p>
      </div>

      <div className="self-start mb-4">
        <b>Bio:</b>
        <p className="inline-block ml-3">{estudiante.bio}</p>
      </div>

      <div className="self-start mb-4">
        <b>Intereses:</b>
        <ul className="mt-2">
          {estudiante.intereses?.map((interes, index) => (
            <li key={index} className="ml-3">{interes}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
