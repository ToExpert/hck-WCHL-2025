import { Navigate } from "react-router-dom";

const GuestSecurity = ({ isAuth, children }) => {
    if (isAuth) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}

export default GuestSecurity;