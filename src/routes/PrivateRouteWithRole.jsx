import { Forbidden } from '../paginas/Forbidden';
import { useAuthStore } from '../Chat/store/useAuthStore';


export default function PrivateRouteWithRole({ children }) {
    const { authUser } = useAuthStore()

    if ("Estudiante" === authUser.rol) {
        return <Forbidden/>
    } else {
        return children
    }
}