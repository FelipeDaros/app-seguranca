import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export async function GetCompanyUser() {
  const post_id = await AsyncStorage.getItem("post_id");


  const {data} = await api.get(`/company/${post_id}`);

  return data;
}