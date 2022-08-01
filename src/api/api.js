import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://backend-seguranca.herokuapp.com/api'
});

export default api;