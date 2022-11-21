import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUND_COLLECTION } from "../storageConfig";
import { RoundStorageDTO } from "./RoundStorageDTO";

export type Round = {
  id: string;
  locale: string;
  name: string;
  stats: string;
}

export async function roudsFindAll() {
  try {
    const storage = await AsyncStorage.getItem(ROUND_COLLECTION);

    const rounds: Round[] = storage ? JSON.parse(storage) : [];

    return rounds;
  } catch (error) {
    throw error;
  }
}