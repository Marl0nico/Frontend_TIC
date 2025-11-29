import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ModalMiembros from "../components/Modals/ModalMiembros";
import { useAuthStore } from "../Chat/store/useAuthStore";
import { Pencil, Trash2 } from "lucide-react";

const VisualizarComunidad = () => {
  const [comunidad, setComunidad] = useState({});
  const { authUser, token } = useAuthStore();
  const { id } = useParams();

  const navigate = useNavigate();

  const unirseComunidad = async (id) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/comunidades/${id}/unirse`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(url, { _id: authUser?._id }, options);
      toast.success("Te has unido a la comunidad exitosamente.");
      consultarComunidad();
    } catch (error) {
      toast.error(error.response.data.mensaje);
    }
  };

  // Función para eliminar una comunidad
  const eliminarComunidad = async (id) => {
    try {
      const confirmar = confirm("¿Estás seguro de eliminar esta comunidad?");
      if (confirmar) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades/${id}`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(url, options);
        navigate('/dashboard/listar')
      }
    } catch (error) {
      console.error("Error al eliminar la comunidad:", error);
    }
  };
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setMinutes(
      nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset()
    );
    return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
      nuevaFecha
    );
  };

  const consultarComunidad = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades/${id}`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setComunidad(respuesta.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos de la comunidad");
    }
  }, [id, token]);

  useEffect(() => {
    consultarComunidad();
  }, [consultarComunidad]);
  if (!comunidad) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      <div>
        <h1 className="font-black text-4xl text-gray-500">
          Información de la Comunidad
        </h1>
        <div>
          {Object.keys(comunidad).length !== 0 ? (
            <>
              <div className="m-5 flex justify-between">
                <div className="w-2/3">
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Nombre: {" "}
                    </span>
                    {comunidad.nombre}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Descripción: {" "}
                    </span>
                    {comunidad.descripcion}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Tipo: {" "}
                    </span>
                    {comunidad.tipo}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Carrera Relacionada: {" "}
                    </span>
                    {comunidad.carreraRelacionada || "No especificada"}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Estado: {" "}
                    </span>
                    <span
                      className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${
                        comunidad.estado
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {comunidad.estado ? "Activa" : "Inactiva"}
                    </span>
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Miembros: {" "}
                    </span>
                    {comunidad.estudiantes?.length || 0} estudiantes
                  </p>
                  <ModalMiembros miembros={comunidad.estudiantes} />
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Intereses Relacionados: {" "}
                    </span>
                    {comunidad.interesesRelacionados?.join(", ") || "Ninguno"}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Fecha de Creación: {" "}
                    </span>
                    {formatearFecha(comunidad.createdAt)}
                  </p>
                  <p className="text-md text-gray-00 mt-4">
                    <span className="text-gray-600 uppercase font-bold">
                       Última Actualización: {" "}
                    </span>
                    {formatearFecha(comunidad.updatedAt)}
                  </p>
                </div>
                <div className="w-1/3 flex justify-center">
                  {comunidad.logo ? (
                    <img
                      src={comunidad.logo.url}
                      alt="Logo de la comunidad"
                      className="h-64 w-64 object-contain rounded-2xl"
                    />
                  ) : (
                    <img
                      src="/images/defaultprofile.jpg"
                      alt="Logo por defecto"
                      className="h-64 w-64 object-contain opacity-50"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                <p className="text-sm text-gray-600">
                  Creada por: {comunidad.administrador.nombre}{" "}
                  {comunidad.administrador.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  {comunidad.administrador.email}
                </p>
                {authUser?.rol ===
                "Administrador" ? null : comunidad.estudiantes?.find(
                    (estudiante) => estudiante.usuario === authUser?.usuario
                  ) ? (
                  <button
                    className="bg-blue-600 text-white p-2 mt-4 rounded-md"
                    onClick={() => navigate(`/dashboard/${comunidad._id}/chat`)}
                  >
                    Chat
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white p-2 mt-4 rounded-md"
                    onClick={() => unirseComunidad(comunidad._id)}
                  >
                    Unirse a la comunidad
                  </button>
                )}
                {authUser.rol === "Administrador" && (
                  <div className="flex items-center gap-x-4 p-5">
                    <div className="flex flex-col items-center cursor-pointer">
                      <Pencil
                        className="h-7 w-7 text-slate-800"
                        onClick={() =>
                          navigate(`/dashboard/actualizar/${comunidad._id}`)
                        }
                      />
                      <span className="text-sm text-slate-800">Editar</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer">
                      <Trash2
                        className="h-7 w-7 text-red-900"
                        onClick={() => eliminarComunidad(comunidad._id)}
                      />
                      <span className="text-sm text-red-900">Eliminar</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default VisualizarComunidad;
