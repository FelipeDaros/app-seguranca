import axios from 'axios';


const api = axios.create({
  baseURL: "http://192.168.10.172:3000/api" || "131.221.176.2:3000/api" || "45.4.51.95:3000/api"
});

export default api;