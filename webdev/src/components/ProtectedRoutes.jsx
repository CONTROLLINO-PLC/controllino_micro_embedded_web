import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/login" replace />}
    />
  );
};
export default PrivateRoute;
