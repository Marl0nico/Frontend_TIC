import PropTypes, { string } from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserFormField } from "../Estudiantes/EstudianteForm";

export function ViewUserModal({ user, isOpen, onClose }) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles Estudiante</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                  <img
                    src={
                      user?.fotoPerfil?.url ||
                      "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                    }
                    alt="img-client"
                  />
                </div>
              </div>
            </div>
          </div>
          <UserFormField label="Nombre" value={user.nombre} readOnly />
          <UserFormField label="Email" value={user.email} readOnly />
          <UserFormField
            label="Universidad"
            value={user.universidad}
            readOnly
          />
          <UserFormField label="Carrera" value={user.carrera} readOnly />
          <UserFormField label="Bio" value={user.bio} readOnly />
        </div>
      </DialogContent>
    </Dialog>
  );
}

ViewUserModal.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    universidad: PropTypes.string.isRequired,
    carrera: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    fotoPerfil: PropTypes.shape({
      url: string,
      public_id: string,
    }),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
