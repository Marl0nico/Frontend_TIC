import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../Chat/store/useAuthStore";

const FormularioPerfil = () => {
  const { authUser, actualizarPerfil } = useAuthStore();

  const [form, setForm] = useState(
    authUser.rol === "Administrador"
      ? {
          id: authUser._id,
          nombre: authUser.nombre || "",
          apellido: authUser.apellido || "",
          direccion: authUser.direccion || "",
          telefono: authUser.telefono || "",
          email: authUser.email || "",
        }
      : {
          id: authUser._id,
          nombre: authUser.nombre || "",
          usuario: authUser.usuario || "",
          email: authUser.email || "",
          carrera: authUser.carrera || "",
          celular: authUser.celular || "",
          intereses: Array.isArray(authUser.intereses) 
          ? authUser.intereses.join(", ") 
          : authUser.intereses || "",
          bio: authUser.bio || "",
          fotoPerfil: null,
        }
  );
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setForm({
      ...form,
      fotoPerfil: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((value) => value === "")) {
      toast.error("Todos los campos deben ser ingresados");
      return;
    }
    // Construir intereses de forma segura: puede ser string, array o undefined
    let interesesArray = [];
    if (typeof form.intereses === 'string' && form.intereses.trim() !== '') {
      interesesArray = form.intereses
        .split(',')
        .map(item => item.trim().replace(/^"(.*)"$/, '$1'))
        .filter(item => item !== '');
    } else if (Array.isArray(form.intereses)) {
      interesesArray = form.intereses;
    }

    const finalData = {
      ...form,
      intereses: interesesArray,
    };
    const resultado = await actualizarPerfil(finalData);
    if (resultado.ok) {
      toast.success(resultado.msg);
    } else {
      toast.error(resultado.msg);
    }
  };

  return (
    <>
      {authUser.rol === "Administrador" ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="nombre"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Nombre:
            </label>
            <input
              id="nombre"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Apellido:
            </label>
            <input
              id="apellido"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="direccion"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Dirección:
            </label>
            <input
              id="direccion"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Teléfono:
            </label>
            <input
              id="telefono"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Email:
            </label>
            <input
              id="email"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="email"
              name="email"
              value={form.email}
              readOnly
              aria-readonly="true"
              //onChange={handleChange}
            />
          </div>

          <input
            type="submit"
            className="bg-gray-800 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
            value="Actualizar"
          />
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="nombre"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Nombre Completo:
            </label>
            <input
              id="nombre"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: Juan Perez"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="usuario"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Usuario:
            </label>
            <input
              id="usuario"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: juanperez"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: juan@gmail.com"
              name="email"
              value={form.email}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div>
            <label
              htmlFor="celular"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Celular:
            </label>
            <input
              id="celular"
              type="tel"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: 1234567890"
              name="celular"
              value={form.celular}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="carrera"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Carrera:
            </label>
            <input
              id="carrera"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: Ingeniería en Sistemas"
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="intereses"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Intereses (separados por comas):
            </label>
            <input
              id="intereses"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: Fotografia, Arte"
              name="intereses"
              value={form.intereses}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Bio:
            </label>
            <input
              id="bio"
              type="text"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
              placeholder="ej: Tengo 20 años.."
              name="bio"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="fotoPerfil"
              className="text-gray-700 uppercase font-bold text-sm"
            >
              Foto de Perfil:
            </label>
            <input
              id="fotoPerfil"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5 text-gray-700"
            />
          </div>

          <input
            type="submit"
            className="bg-gray-800 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
            value="Actualizar"
          />
        </form>
      )}
    </>
  );
};

export default FormularioPerfil;
