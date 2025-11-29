import { useEffect } from "react";
import { useAuthStore } from "../../Chat/store/useAuthStore";

export const CardPerfil = () => {
  const { checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div
      className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg"
    >
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
          <img
            src={
              authUser?.fotoPerfil?.url ||
              "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
            }
            alt="img-client"
          />
        </div>
      </div>

      {authUser.rol === "Administrador" ? (
        <>
          <div className="self-start">
            <b>Nombre:</b>
            <p className="inline-block ml-3">{authUser.nombre}</p>
          </div>
          <div className="self-start">
            <b>Apellido:</b>
            <p className="inline-block ml-3">{authUser.apellido}</p>
          </div>
          <div className="self-start">
            <b>Dirección:</b>
            <p className="inline-block ml-3">{authUser.direccion}</p>
          </div>
          <div className="self-start">
            <b>Teléfono:</b>
            <p className="inline-block ml-3">{authUser.telefono}</p>
          </div>
          <div className="self-start">
            <b>Email:</b>
            <p className="inline-block ml-3">{authUser.email}</p>
          </div>
        </>
      ) : (
        <>
          <div className="self-start">
            <b>Nombre:</b>
            <p className="inline-block ml-3">{authUser.nombre}</p>
          </div>
          <div className="self-start">
            <b>Celular:</b>
            <p className="inline-block ml-3">{authUser.celular}</p>
          </div>
          <div className="self-start">
            <b>Email:</b>
            <p className="inline-block ml-3">{authUser.email}</p>
          </div>
          <div className="self-start">
            <b>Universidad:</b>
            <p className="inline-block ml-3">{authUser.universidad}</p>
          </div>
          <div className="self-start">
            <b>Carrera:</b>
            <p className="inline-block ml-3">{authUser.carrera}</p>
          </div>
        </>
      )}
    </div>
  );
};
