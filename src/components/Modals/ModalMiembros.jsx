import React, { useState } from "react";
import PropTypes from "prop-types";
import { User, UserRoundMinus, UserRoundPlus } from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuthStore} from "../../Chat/store/useAuthStore"

function ModalMiembros({ miembros }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, token, checkAuth } = useAuthStore();

  const agregarAmigo = async (id, usuario) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/estudiante/${id}/agregar`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(url, { _id: authUser?._id }, options);
      toast.success(`Has agregado a ${usuario} exitosamente.`);
      checkAuth();
    } catch (error) {
      toast.error(error.response.data.mensaje);
    }
  };
  const eliminarAmigo = async (id, usuario) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/estudiante/${id}/eliminar`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(url, { _id: authUser?._id }, options);
      toast.success(`Has eliminado a ${usuario} exitosamente.`);
      checkAuth();
    } catch (error) {
      toast.error(error.response.data.mensaje);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex items-start justify-start">
        <button
          type="button"
          onClick={openModal}
          className="bg-gray-800 inline-flex text-sm p-2 
        text-slate-300 uppercase font-bold rounded-lg 
        hover:bg-gray-600 cursor-pointer transition-all"
        >
          Ver miembros
        </button>
      </div>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Miembros
                  </DialogTitle>
                  <div className="mt-2">
                    <ul className="divide-y divide-gray-200">
                      {miembros.map((member) => (
                        <li
                          key={member._id}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                member?.fotoPerfil?.url ||
                                "/images/defaultprofile.jpg"
                              }
                              alt=""
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {member.nombre}
                              </p>
                              <p className="text-sm text-gray-500">
                                @{member.usuario}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={() =>
                                navigate(`/dashboard/perfil/${member._id}`)
                              }
                            >
                              <User className="h-6 w-6 text-gray-700" />
                            </button>
                            {member._id !== authUser._id &&
                              (authUser.amigos?.find(
                                (amigo) => amigo._id === member._id
                              ) ? (
                                <button
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  onClick={() =>
                                    eliminarAmigo(member._id, member.usuario)
                                  }
                                >
                                  <UserRoundMinus className="h-6 w-6 text-red-600" />
                                </button>
                              ) : (
                                <button
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  onClick={() =>
                                    agregarAmigo(member._id, member.usuario)
                                  }
                                >
                                  <UserRoundPlus className="h-6 w-6 text-gray-700" />
                                </button>
                              ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cerrar
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

ModalMiembros.propTypes = {
  miembros: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      usuario: PropTypes.string.isRequired,
      fotoPerfil: PropTypes.shape({
        url: PropTypes.string.isRequired,
        public_id: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
};

export default ModalMiembros;
