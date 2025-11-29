import { useCallback, useEffect, useState } from "react";
import { TablaEstudiantes } from "./TablaEstudiantes"
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/Chat/store/useAuthStore";
import PropTypes from "prop-types";

export function ActiveUsers({ searchQuery }) {
  const [activeUsers, setActiveUsers] = useState([])
  const {token} = useAuthStore()
  const consultarUsuarios = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes/`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setActiveUsers(respuesta.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos de la comunidad");
    }
  }, [token]);

  useEffect(() => {
    consultarUsuarios();
  }, [consultarUsuarios]);
  if (!activeUsers) {
    return <div>Cargando...</div>;
  }
  const filteredUsers = activeUsers.filter(user =>
    user.nombre
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Estudiantes Activos</h2>
      <TablaEstudiantes users={filteredUsers} userState="active" />
    </div>
  )
}
ActiveUsers.propTypes = {
  searchQuery: PropTypes.string,
};

