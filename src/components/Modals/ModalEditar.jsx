import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserFormField } from "../Estudiantes/EstudianteForm"

export function EditUserModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({ nombre: "", email: "", universidad: "",carrera: "",celular: "",usuario: ""})

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...user, ...formData })
    onClose()
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Estudiante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <UserFormField label="Nombre" value={formData.nombre} onChange={handleChange("nombre")} />
            <UserFormField label="Email" value={formData.email} onChange={handleChange("email")} />
            <UserFormField label="Universidad" value={formData.universidad} onChange={handleChange("universidad")} />
            <UserFormField label="Carrera" value={formData.carrera} onChange={handleChange("carrera")} />
            <UserFormField label="Celular" value={formData.celular} onChange={handleChange("celular")} />
            <UserFormField label="Usuario" value={formData.usuario} onChange={handleChange("usuario")} />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Define prop types
EditUserModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    usuario: PropTypes.string.isRequired,
    celular: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    universidad: PropTypes.string.isRequired,
    carrera: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}