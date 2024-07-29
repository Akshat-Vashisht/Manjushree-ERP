import axios from "axios";
const baseURL = process.env.REACT_APP_BACKEND_SERVICE;

console.log(baseURL);

export const axiosConfig = axios.create({
    baseURL: baseURL,
    withCredentials:true
});