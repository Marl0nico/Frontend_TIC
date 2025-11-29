import PropTypes from "prop-types"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit2, UserX, UserCheck } from "lucide-react"
import { EditUserModal } from "../Modals/ModalEditar"
import { ViewUserModal } from "../Modals/ModalEstudiante"
import { UserActionModal } from "../Modals/ModalAccion"
import { useAuthStore } from "@/Chat/store/useAuthStore"
import axios from "axios"
import toast from "react-hot-toast"


export function TablaEstudiantes({ users, userState }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { token } = useAuthStore();

  const handleAction = (user) => {
    setSelectedUser(user)
    console.log(selectedUser)
    setIsActionModalOpen(true)
  }

  const handleView = (user) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleConfirmAction = async () => {
    try {
      const isActive = userState === "active";
      const url = isActive
        ? `${import.meta.env.VITE_BACKEND_URL}/estudiante/eliminar/${selectedUser._id}`  
        : `${import.meta.env.VITE_BACKEND_URL}/estudiante/reactivar/${selectedUser._id}`;
  
      const method = isActive ? "delete" : "put";
  
      await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Mostrar mensaje de éxito con toast
      toast.success(
        `Usuario ${isActive ? "deshabilitado" : "reactivado"} exitosamente`
      );
  
      console.log(`${isActive ? "Disabled" : "Reactivated"} user:`, selectedUser);
    } catch (error) {
      console.error("Error en la acción del usuario:", error);
      
      // Manejo de errores con toast
      toast.error("Hubo un error al procesar la acción. Inténtalo de nuevo.");
    } finally {
      setIsActionModalOpen(false);
    }
  };

  const handleSaveEdit = async(updatedUser) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/estudiante/actualizar/${updatedUser._id}/`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(url, updatedUser, options);
      toast.success(`Has editado a ${updatedUser.usuario} exitosamente.`);
    } catch (error) {
      toast.error(error.response.data.mensaje);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Universidad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.universidad}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" title="View" onClick={() => handleView(user)}>
                    <Eye className="h-4 w-4" />
                  </Button>

                  {userState === "active" ? (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      title="Disable"
                      onClick={() => handleAction(user)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-green-500 hover:text-green-700"
                      title="Reactivate"
                      onClick={() => handleAction(user)}
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={userState === "active" ? "Desactivar Estudiante" : "Reactivar Estudiante"}
        description={`Estas seguro de que quieres ${
          userState === "active" ? "desactivar" : "reactivar"
        } ${selectedUser?.nombre}?`}
        confirmText={userState === "active" ? "Desactivar" : "Reactivar"}
      />

      <ViewUserModal user={selectedUser} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />

      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </>
  )
}

// Define prop types
TablaEstudiantes.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      universidad: PropTypes.string.isRequired,
    })
  ).isRequired,
  userState: PropTypes.oneOf(["active", "disabled"]).isRequired,
}