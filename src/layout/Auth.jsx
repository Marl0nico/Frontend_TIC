import {Outlet} from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../Chat/store/useAuthStore';

const Auth = () => {
    const { token } = useAuthStore();
    return (
        <main className="flex justify-center content-center w-full h-screen ">
        {token ? <Navigate to='/dashboard' /> :  <Outlet/>}
        </main>
    )
}

export default Auth