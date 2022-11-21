import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUND_COLLECTION } from "../storageConfig";
import { roudsFindAll } from "./roundFindAll";

export async function roundRemoveById(id: string) {
  try {
    const storedRounds = await roudsFindAll();

    const rounds = storedRounds.filter(round => round.id !== id);

    await AsyncStorage.setItem(ROUND_COLLECTION, JSON.stringify(rounds));
      
  } catch (error) {
    throw error;
  }
}