import React, { useState } from "react";
import PropTypes from "prop-types";
import { LucideMessageCircle, User, UserRoundMinus } from "lucide-react";
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
import { useAuthStore } from "../../Chat/store/useAuthStore";

function ModalAmigos() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, checkAuth,token } = useAuthStore();
  const amigos = authUser.amigos || [];

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
          className="bg-blue-600 inline-flex text-base p-2 
        text-slate-300 font-bold rounded-lg 
        hover:bg-blue-700 cursor-pointer transition-all"
        >
          Amigos
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
                    Amigos
                  </DialogTitle>
                  <div className="mt-2">
                    {amigos.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {amigos.map((amigo) => (
                          <li
                            key={amigo._id}
                            className="py-4 flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  amigo.fotoPerfil?.url ||
                                  "/images/defaultprofile.jpg"
                                }
                                alt=""
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {amigo.nombre}
                                </p>
                                <p className="text-sm text-gray-500">
                                  @{amigo.usuario}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={() => {
                                  closeModal();
                                  navigate(`/dashboard/perfil/${amigo._id}`);
                                }}
                              >
                                <User className="h-6 w-6 text-gray-700" />
                              </button>
                              {authUser.amigos?.find(
                                (a) => a._id === amigo._id
                              ) && (
                                <>
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    onClick={() => {
                                      closeModal();
                                      navigate(`/dashboard/chat/amigos`);
                                    }}
                                  >
                                    <LucideMessageCircle className="h-6 w-6 text-gray-700" />
                                  </button>
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    onClick={() =>
                                      eliminarAmigo(amigo._id, amigo.usuario)
                                    }
                                  >
                                    <UserRoundMinus className="h-6 w-6 text-red-600" />
                                  </button>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No tienes amigos agregados aún. ¡Comienza a conectar con
                        otros usuarios!
                      </p>
                    )}
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

ModalAmigos.propTypes = {
  amigos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      usuario: PropTypes.string.isRequired,
      fotoPerfil: PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
      }),
    })
  ),
};

export default ModalAmigos;
