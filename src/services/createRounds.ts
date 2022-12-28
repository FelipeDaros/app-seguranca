import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { RoundCreate } from "../storage/round/roundCreate";
import { ROUND_COLLECTION } from "../storage/storageConfig";
import { GetCompanyUser } from "./GetCompanyUser";

export async function createRounds(){
  const {company_id} = await GetCompanyUser();
  
  try {
    const {data} = await api.get(`/point/${company_id}`);
    RoundCreate(data);
    const rounds = await AsyncStorage.getItem(ROUND_COLLECTION);
    
    return rounds;
  } catch (error) {
    console.log(error.response.data);
  }
}