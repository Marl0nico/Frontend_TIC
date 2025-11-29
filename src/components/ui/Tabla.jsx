import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/Chat/store/useAuthStore";
import { ComunidadCard } from "./CardComunidad";
import { useNavigate } from "react-router-dom";

const TablaComunidades = () => {
  const { token, authUser } = useAuthStore(); // Información del usuario autenticado
  const navigate = useNavigate();
  const [comunidades, setComunidades] = useState([]);

  // Función para obtener todas las comunidades
  const listarComunidades = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setComunidades(respuesta.data);
    } catch (error) {
      console.error("Error al listar las comunidades:", error);
    }
  }, [token]);

  useEffect(() => {
    listarComunidades();
  }, [listarComunidades]);

  return (
    <>
      {comunidades.length === 0 ? (
        <p>No existen comunidades registradas.</p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-6">Servidores destacados</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {comunidades.map((community) => (
              <ComunidadCard key={community._id} comunidad={community} />
            ))}
          </div>
        </div>
      )}
      {authUser?.rol === "Administrador" && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-600 text-white p-2 rounded-md"
            onClick={() => navigate(`/dashboard/crear`)}
          >
            Crear
          </button>
        </div>
      )}
    </>
  );
};

export default TablaComunidades;
