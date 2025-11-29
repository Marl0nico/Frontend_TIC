import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_SOCKET;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      token: null, // Remove localStorage.getItem since persist will handle this
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
      setToken: (newToken) => {
        set({ token: newToken });
      },
      actualizarPassword: async (datos) => {
        try {
          const { token, authUser } = get();
          const endpoint =
            authUser?.rol === "Administrador"
              ? "/administrador/actualizarpassword"
              : "/estudiante/actualizarpassword";

          const respuesta = await axiosInstance.put(endpoint, datos, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return { msg: respuesta.data.msg, ok: true };
        } catch (error) {
          return {
            msg: error.response?.data?.msg || "Error al actualizar",
            ok: false,
          };
        }
      },

      // Método para actualizar perfil
      actualizarPerfil: async (datos) => {
        try {
          const { token, authUser } = get();
          if (authUser?.rol === "Estudiante") {
            const url = `/estudiante/actualizar/${datos.id}`;
            const formData = new FormData();

            formData.append("nombre", datos.nombre);
            formData.append("usuario", datos.usuario);
            formData.append("email", datos.email);
            formData.append("celular", datos.celular);
            formData.append("intereses", JSON.stringify(datos.intereses));
            formData.append("bio", datos.bio);
            formData.append("fotoPerfil", datos.fotoPerfil);

            const respuesta = await axiosInstance.put(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            });
            return { msg: respuesta.data.msg, ok: true };
          } else {
            const endpoint = `/administrador/${datos.id}`;

            const respuesta = await axiosInstance.put(endpoint, datos, {
              headers: { Authorization: `Bearer ${token}` },
            });
            // Actualizar datos locales después de la modificación
            await get().checkAuth();
            return { msg: respuesta.data.msg, ok: true };
          }
        } catch (error) {
          return {
            msg: error.response?.data?.msg || "Error al actualizar",
            ok: false,
          };
        }
      },

      checkAuth: async () => {
        try {
          const { token, authUser } = get();
          if (!token) throw new Error("No autenticado");

          const endpoint =
            authUser?.rol === "Administrador"
              ? "/admin/perfil"
              : "/estudiante/perfil";

          const respuesta = await axiosInstance.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            authUser: { ...respuesta.data },
            token: respuesta.data.token,
          });

          get().connectSocket();
          return true;
        } catch (error) {
          set({ authUser: null, token: null });
          return false;
        }
      },
      login: async (data, isAdmin = false) => {
        try {
          const endpoint = isAdmin ? "/login" : "/estudiante/login";
          const res = await axiosInstance.post(endpoint, data);

          set({
            authUser: { ...res.data },
            token: res.data.token,
          });

          get().connectSocket();
          toast.success(`Bienvenido ${res.data.nombre}`);
        } catch (error) {
          toast.error(error.response?.data?.msg || "Error de autenticación");
        }
      },
      logout: async () => {
        try {
          set({ authUser: null, token: null });
          toast.success("Hasta luego!");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
          transports: ["websocket"], // Force WebSocket transport
          withCredentials: true,
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // only persist these states
        authUser: state.authUser,
        token: state.token,
      }),
    }
  )
);
