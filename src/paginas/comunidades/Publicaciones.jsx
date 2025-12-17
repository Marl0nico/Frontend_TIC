import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

const Publicaciones = ({ token }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [selectedPublicacion, setSelectedPublicacion] = useState(null);

  const fetchPublicaciones = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/obtener`);
      setPublicaciones(res.data);
      console.log("Publicaciones cargadas:", res.data);
    } catch (err) {
      toast.error("Error al cargar publicaciones");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const handleCreatePublicacion = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("texto", newText);
      if (newImage) formData.append("imagen", newImage);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/publicacion`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPublicaciones([res.data, ...publicaciones]);
      setNewText("");
      setNewImage(null);
      toast.success("Publicación creada");
    } catch (err) {
      toast.error("Error al crear publicación");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleCreatePublicacion} className="mb-4 flex flex-col gap-2">
        <textarea
          placeholder="Escribe tu publicación..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="input input-bordered w-full bg-gray-700 text-white"
        />
        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="file-input file-input-bordered file-input-sm w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary mt-2">Publicar</button>
      </form>

      <div className="space-y-4">
        {publicaciones.map((pub) => (
          <div key={pub._id} className="bg-gray-800 p-3 rounded-lg">
            {pub.texto && <p>{pub.texto}</p>}
            {pub.imagen?.url && (
              <img src={pub.imagen.url} alt="publicacion" className="mt-2 rounded" />
            )}
            <button
              className="btn btn-sm btn-secondary mt-2"
              onClick={() => setSelectedPublicacion(pub._id)}
            >
              Ver comentarios
            </button>
          </div>
        ))}
      </div>

      {selectedPublicacion && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Comentarios</h3>
          {}
        </div>
      )}
    </div>
  );
};

export default Publicaciones;