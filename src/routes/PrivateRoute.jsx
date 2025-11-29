import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../Chat/store/useAuthStore';

export const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  
  return token ? children : <Navigate to="/login" replace/>;
};