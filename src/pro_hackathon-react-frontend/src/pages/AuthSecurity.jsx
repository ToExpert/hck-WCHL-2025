import { Navigate } from "react-router-dom";

const AuthSecurity = ({ isAuth, children, redirectTo = "/" }) => {
    if (!isAuth) {
        return <Navigate to={redirectTo} replace />
    }
 
    return children;
}

export default AuthSecurity;