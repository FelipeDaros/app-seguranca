import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";



export default class CrudService{
  async save(rota, data){
    const token = await AsyncStorage.getItem("token");
    return api.post(`${rota}`, data, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });
  }

  async update(rota, data){
    const token = await AsyncStorage.getItem("token");
    return api.put(rota, data, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    })
  }

  async findAll(rota){
    const token = await AsyncStorage.getItem("token");
    return api.get(rota,{
      headers: {
        'Authorization': `Basic ${token}`
      }
    })
  }

  async findAllRoundUser(rota, data){
    const token = await AsyncStorage.getItem("token");
    return api.get(rota, data,{
      headers: {
        'Authorization': `Basic ${token}`
      }
    })
  }

  async findOne(rota, id){
    const token = await AsyncStorage.getItem("token");
    return api.get(`${rota}${id}`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });
  }

  async findAllItensPost(rota){
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("post");
    return api.get(`${rota}/${id}`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });
  }


  async findLatestItensPost(rota){
    const token = await AsyncStorage.getItem("token");
    const post = await AsyncStorage.getItem("post");
    return api.get(`${rota}/${post}`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });
  }
}
