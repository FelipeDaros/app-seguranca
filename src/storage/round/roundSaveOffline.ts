import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "../../error/AppError";
import { ROUND_COLLECTION_OFFLINE } from "../storageConfig";
import { RoundFindAllOffline } from "./roundFindAllOffline";
import { RoundStorageDTO } from "./RoundStorageDTO";



export async function RoundSaveOffiline(data: RoundStorageDTO) {
  try {
    const storedRoundsOffiline = await RoundFindAllOffline();
    
    const roundOfflineAlreadyExists = storedRoundsOffiline.includes(data);

    if(roundOfflineAlreadyExists){
      throw new AppError("Você já fez esse ponto!");
    }

    const storage = JSON.stringify([...storedRoundsOffiline, data]);

    await AsyncStorage.setItem(ROUND_COLLECTION_OFFLINE, storage);
  } catch (error) {
    throw error;
  }
}