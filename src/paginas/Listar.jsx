import Tabla from '../components/ui/Tabla'

const Listar = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1c4b] to-[#0c0e20] text-white">
      <div className="px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto text-center leading-tight">
          ENCUENTRA TU COMUNIDAD
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto">
          Desde juegos, a música y enseñanza, aquí encontrarás tu sitio.
        </p>
      </div>

      <Tabla/>
    </div>
    )
}

export default Listar