import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoundCreate } from "../storage/round/roundCreate";
import { ROUND_COLLECTION } from "../storage/storageConfig";
import CrudService from "./crudService";

export async function createRounds(){
  const id = await AsyncStorage.getItem("id");
  const post_id = await AsyncStorage.getItem("post")
  const crudService = new CrudService();

  
  try {
    const respose = await crudService.findAll(`/service-point/point/${post_id}`);
    RoundCreate(respose.data);
    const rounds = await AsyncStorage.getItem(ROUND_COLLECTION);
    
    return rounds;
  } catch (error) {
    console.log(error.response.data);
  }
}