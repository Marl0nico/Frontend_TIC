import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function ComunidadCard({ comunidad }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg overflow-hidden bg-[#2b2d31] cursor-pointer" onClick={() =>
      navigate(`/dashboard/visualizar/${comunidad._id}`)
    }>
      <div className="h-48 relative">
        <img
          src={comunidad.logo.url || "/placeholder.svg"}
          alt={`${comunidad.nombre} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white rounded-full p-2">
          <img
            src={comunidad.logo.url || "/placeholder.svg"}
            alt={`${comunidad.nombre} icon`}
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold">{comunidad.nombre}</h3>
          <svg
            className="w-4 h-4 text-[#3ba55c]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm mb-4">{comunidad.descripcion}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>{comunidad.estudiantes.length} miembros</span>
          </div>
        </div>
      </div>
    </div>
  );
}
ComunidadCard.propTypes = {
  comunidad: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    logo: PropTypes.shape({
        url: PropTypes.string.isRequired,
        public_id: PropTypes.string.isRequired,
      }),
    estudiantes: PropTypes.arrayOf(
        PropTypes.string.isRequired,
    ),
  }).isRequired,
};
