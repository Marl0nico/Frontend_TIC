import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreHorizontal, Reply, Trash2, Pencil } from "lucide-react";
import { useAuthStore } from "../../Chat/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
const formatTimestamp = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: false };
  const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };

  // Comparar fechas sin hora
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `hoy a las ${date.toLocaleTimeString("es-ES", optionsTime)}`;
  }
  if (isYesterday) {
    return `ayer a las ${date.toLocaleTimeString("es-ES", optionsTime)}`;
  }
  return `${date.toLocaleDateString(
    "es-ES",
    optionsDate
  )} ${date.toLocaleTimeString("es-ES", optionsTime)}`;
};
const ForoComunidad = () => {
  const { id } = useParams();
  const { authUser, token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [Pub, setPub] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [newMessage, setNewMessage] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessages, setNewMessages] = useState({}); // { [pubId]: "texto" }

  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState({});
  const [textoComentario, setTextoComentario] = useState({});
  const [publicaciones, setPublicaciones] = useState([]);
  const [textoPublicacion, setTextoPublicacion] = useState("");
  const [imagenPublicacion, setImagenPublicacion] = useState(null);
  const [previewUrl, setPreviewUrl]=useState(null);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [editText, setEditText] = useState("")

  const handleImageSelect = (file) => {
    setImagenPublicacion(file || null);

    // Limpiar previa URL si existe
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCrearPublicacion = async (e) => {
    e.preventDefault();
    if (!textoPublicacion.trim() && !imagenPublicacion) {
      toast.error("Debe ingresar texto o imagen");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("texto", textoPublicacion);
      formData.append("comunidad", id); // id de la comunidad
      if (imagenPublicacion) formData.append("imagen", imagenPublicacion);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/publicacion`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Agregar la nueva publicación arriba del listado
      setPublicaciones([response.data, ...publicaciones]);
      setTextoPublicacion("");
      setTextoPublicacion("")
      setImagenPublicacion(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      toast.success("Publicación creada");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la publicación");
    }
  };

  const handleDeletePub = async (id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/publicaciones/${id}`;
      console.log("Eliminando:", url);

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPublicaciones((prevPublicaciones) =>
        prevPublicaciones.filter((pub) => pub._id !== id)
      ); toast.success("Publicación eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar publicación:", error.response?.data || error.message);
      toast.error("La publicación no es tuya.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !token) return;

      setLoading(true);
      setLoadingPublicaciones(true);

      try {
        // Traer publicaciones primero
        const publicacionesResp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/obtener/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPublicaciones(publicacionesResp.data);
        setLoadingPublicaciones(false);

        // Traer comentarios por cada publicación
        const comentariosPromises = publicacionesResp.data.map(pub =>
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/publicacion/${pub._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        const respuestas = await Promise.all(comentariosPromises);

        const allComments = respuestas.flatMap((res, index) =>
          res.data.map(comment => ({
            id: comment._id,
            content: comment.contenido,
            author: {
              name: comment.usuario?.usuario || "Usuario desconocido",
              avatar: comment.usuario?.fotoPerfil?.url || "/placeholder.svg",
              color: "bg-purple-500",
            },
            replyTo: comment.replyTo?._id,
            isDeletedParent: comment.isDeletedParent,
            timestamp: formatTimestamp(comment.fecha_creacion),
            isNew: Date.now() - new Date(comment.fecha_creacion).getTime() < 300000,
            userId: comment.usuario?._id,
            publicacionId: publicacionesResp.data[index]._id,
          }))
        );

        setMessages(allComments);

      } catch (error) {
        console.error("Error al cargar publicaciones o comentarios:", error);
        toast.error("Error al cargar datos del foro");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Cleanup preview URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Enviar nuevo comentario
  const handleSendMessage = async (e, publicacionId) => {
    e.preventDefault();
    const mensaje = (newMessages[publicacionId] || "").trim();
    if (!mensaje) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comentario`,
        {
          publicacion: publicacionId,
          contenido: mensaje,
          comunidad: id,
          replyTo: replyingTo || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar mensajes para mostrar inmediatamente
      const newComment = {
        id: response.data._id,
        content: response.data.contenido,
        author: {
          name: response.data.usuario?.usuario || authUser.usuario,
          avatar: response.data.usuario?.fotoPerfil?.url || "/placeholder.svg",
          color: "bg-blue-500",
        },
        replyTo: replyingTo || null,
        timestamp: formatTimestamp(new Date()),
        isNew: true,
        userId: response.data.usuario?._id || authUser._id,
        publicacionId,
      };

      setMessages([...messages, newComment]);
      setNewMessages({ ...newMessages, [publicacionId]: "" });
      setReplyingTo(null);
      toast.success("Comentario publicado");
    } catch (error) {
      console.error("Error al publicar comentario:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Error al publicar comentario");
    }
  };

const handleUpdateCommentario = async (id, nuevoContenido) => {
  try {
    if (!nuevoContenido.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/comentario/${id}`,
      { contenido: nuevoContenido }
    );

    //Autorefrescar: actualizar el estado local
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, content: nuevoContenido } : msg
      )
    );

    toast.success(response.data.mensaje || "Comentario actualizado correctamente");

    setEditingId(null);

  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    toast.error("No se pudo actualizar el comentario");
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/comentario/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(messages.filter((msg) => msg.id !== id));
      toast.success("Comentario eliminado");
    } catch (error) {
      toast.error("Error al eliminar comentario");
    }
  };

  if (loading) return <div>Cargando comentarios...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#313338] text-gray-100">
      <form
        onSubmit={handleCrearPublicacion}
        className="mt-4 mx-5 p-4 bg-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-start gap-4"
      >
        <textarea
          value={textoPublicacion}
          onChange={(e) => setTextoPublicacion(e.target.value)}
          placeholder="Escribe algo para la comunidad..."
          className="flex-1 min-h-[100px] resize-none rounded-xl border border-gray-700 bg-gray-700 text-gray-100 placeholder-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex flex-col items-start gap-3 md:w-48">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v8.25A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 16.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.5l4.5-4.5L12 13.5l4.5-4.5L21 13.5"
              />
            </svg>
            <span className="text-sm">Subir imagen</span>
            <input
              type="file"
              accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files[0])}
              className="hidden"
            />
          </label>

            {/* Previsualización de la imagen o nombre del archivo */}
            {previewUrl ? (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={previewUrl}
                  alt={imagenPublicacion?.name || 'preview'}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div className="text-sm text-gray-300">
                  <div>{imagenPublicacion?.name}</div>
                  <div className="text-xs text-gray-400">{(imagenPublicacion?.size) ? `${Math.round(imagenPublicacion.size/1024)} KB` : ''}</div>
                </div>
              </div>
            ) : imagenPublicacion ? (
              <p className="mt-2 text-sm text-gray-300">{imagenPublicacion.name}</p>
            ) : null}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
          >
            Publicar
          </button>
        </div>
      </form>

      {/* Listado de publicaciones */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {publicaciones.map((pub) => (
          <div key={pub._id} className="border p-3 rounded bg-gray-800">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
                  <img
                    src={
                      pub.autor?.fotoPerfil?.url || pub.autor?.fotoPerfil || 
                      pub.autor?.foto || 
                      "/placeholder.svg"
                    }
                    alt={pub.autor?.usuario || pub.autor?.nombre || "Usuario"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-100">{pub.autor?.usuario || pub.autor?.nombre || "Usuario desconocido"}</div>
                  <div className="text-xs text-gray-400">{formatTimestamp(pub.fechaCreacion || pub.createdAt || pub.fechaCreacion)}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                  <DropdownMenuItem onClick={() => handleDeletePub(pub._id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Texto e imagen de la publicación */}
            <div className="mt-2">
              <p className="text-gray-100">{pub.texto}</p>

              {pub.imagen?.url && (
                <img style={{ width: "20rem", background: "black", padding: "2rem", borderRadius: "12px", border: "ridge" }} src={pub.imagen.url} alt="publicación" className="mt-2 max-w-full rounded" />
              )}
            </div>

            <div className="mt-4">
              {messages
                .filter((msg) => msg.publicacionId === pub._id)
                .map((message, index, array) => {
                  
                  let indentClass = "";
                  if (index === 0) {
                    indentClass = ""; 
                  } else if (index === 1) {
                    indentClass = "ml-8 pl-4 border-l-2 border-gray-500";
                  } else if (index === 2) {
                    indentClass = "ml-16 pl-4 border-l-2 border-blue-500";
                  } else if (index >= 3) {
                    indentClass = "ml-24 pl-4 border-l-2 border-purple-500";
                  }

                  return (
                    <div
                      key={message.id}
                      className={`group relative ${indentClass}`}
                    >
                      <div className="flex items-start gap-4 group">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={message.author.avatar || "/placeholder.svg"}
                              alt={message.author.name}
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{message.author.name}</span>
                            <span className="text-sm text-gray-400">{message.timestamp}</span>
                            {message.isNew && <div className="badge badge-info">NUEVO</div>}
                          </div>

                          {editingId === message.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateCommentario(message.id, editText, () => setEditingId(null));
                              }}
                            >
                              <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                autoFocus
                                className="input input-bordered w-full mt-1 bg-gray-500 text-white"
                              />
                              <div className="flex gap-2 mt-1">
                                <button
                                  type="submit"
                                  className="bg-green-500 px-3 py-1 rounded text-white"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  className="bg-red-500 px-3 py-1 rounded text-white"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p
                              className="mt-1 cursor-pointer"
                              onClick={() => {
                                setEditingId(message.id);
                                setEditText(message.content); // inicializa input con el texto actual
                              }}
                            >
                              {message.content}
                            </p>
                          )}
                        </div>

                        {authUser._id === message.userId || authUser.rol === "Administrador" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                              <DropdownMenuItem onClick={() => setEditingId(message.id)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(message.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setReplyingTo(message.id)}>
                                <Reply className="w-4 h-4 mr-2" /> Reply
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                              <DropdownMenuItem onClick={() => setReplyingTo(message.id)}>
                                <Reply className="w-4 h-4 mr-2" /> Reply
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            <form
              onSubmit={(e) =>
                handleSendMessage(e, pub._id, pub.comunidad?._id || pub.comunidad)
              }
              className="mt-4 p-3 bg-gray-700 rounded"
            >
              {replyingTo && (
                <div className="flex items-center gap-2 p-2 mb-2 text-sm text-gray-400 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-1 flex-1">
                    <Reply className="w-4 h-4" />
                    <span>Respondiendo a </span>
                    <span className="font-medium text-purple-400">
                      @{messages.find((m) => m.id === replyingTo)?.author.name || "[Eliminado]"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="btn btn-ghost btn-xs btn-circle hover:bg-gray-700"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  value={newMessages[pub._id] || ""}
                  onChange={(e) =>
                    setNewMessages({ ...newMessages, [pub._id]: e.target.value })
                  }
                  placeholder="Escribe tu comentario..."
                  className="input input-bordered flex-1 bg-gray-600"
                />
                <button type="submit" className="btn btn-primary">
                  Comentar
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ForoComunidad;
