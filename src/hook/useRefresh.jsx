import axios from '../api/axios';
import useAuth from './useAuth';
import { jwtDecode } from 'jwt-decode';

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/api/refreshToken', {
            withCredentials: true
        });
        let data = response.data?.accessToken  ? jwtDecode(response.data?.accessToken).UserInfo : {}
        setAuth(prev => {
           console.log("userid",data)
            return { ...prev, accessToken: response.data.accessToken,data}
        });
        return response.data.accessToken;
    }
    return refresh;
};

