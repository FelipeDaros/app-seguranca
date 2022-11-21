import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUND_COLLECTION_OFFLINE } from "../storageConfig";
import { RoundStorageDTO } from "./RoundStorageDTO";


export async function RoundFindAllOffline() {
  try {
    const storageRoundOffiline = await AsyncStorage.getItem(ROUND_COLLECTION_OFFLINE);

    const roundsOffline: RoundStorageDTO[]  = storageRoundOffiline ? JSON.parse(storageRoundOffiline) : [];

    return roundsOffline;
  } catch (error) {
    throw error;
  }
}