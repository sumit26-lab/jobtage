import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth ,setpersist} = useAuth();

    const logout = async () => {
        console.log("Logout....>")
        try {
            const response = await axios.get('/api/user/logout', {
                withCredentials: true
            });
            setAuth({});
            setpersist(false)
           await localStorage.setItem('persist','false')
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout