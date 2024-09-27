import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
   
    const [auth, setAuth] = useState({});
    const [jobs,setjobs] = useState({});
    const [persist, setpersist] = useState(() => {
        return localStorage.getItem('persist') === 'true'; // Convert from string to boolean
    });

   
   console.log(auth)
 
    return (
        <AuthContext.Provider value={{ auth, setAuth,persist,setpersist,jobs,setjobs }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;