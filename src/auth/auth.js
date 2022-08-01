import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from 'axios';

export async function verifyAuth(email, password){
  const { Screen } = createNativeStackNavigator();

  const data = await axios.post('https://backend-seguranca.herokuapp.com/api/users/signin',
  {
    email,
    password
  }
  ).then(async (r) => {
    const {jwtToken} = r.data;
    await AsyncStorage.setItem("token", jwtToken);
  }).catch(e => {
    Screen.navigate("Login");
    Alert.alert(`Usuário ${email}`, 'Email ou senha incorretas');
  })

  return data;
}