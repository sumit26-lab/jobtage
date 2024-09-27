import axios from 'axios';
const baseURL = 'http://localhost:4000';

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