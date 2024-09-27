import axios from 'axios';



const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("baseURL",baseURL)
export default axios.create({
    baseURL: baseURL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true

});
export const axiosPrivate  =axios.create({
    baseURL: baseURL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true

});