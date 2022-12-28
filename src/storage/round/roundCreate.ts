import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "../../infra/error/AppError";
import { ROUND_COLLECTION } from "../storageConfig";
import { roudsFindAll, Round } from "./roundFindAll";


export async function RoundCreate(round: Round){
  try {
    const storedGroups = await roudsFindAll();

    const roundAlreadyExists = storedGroups.includes(round);

    if(roundAlreadyExists){
      throw new AppError("Todos inclusos!");
    }

    const storage = JSON.stringify(round);

    await AsyncStorage.setItem(ROUND_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}