import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from "react";
import CrudService from "../services/crudService";
import eskimoIcone from '../../assets/logo.png'
import dayjs from "dayjs";
import * as Location from 'expo-location';
import ComponentButton from "../components/Button";
import { useTheme } from "native-base";


export default function Login({ navigation }){
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const crudService = new CrudService();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  async function login(){
    setLoading(true);
    const data = await crudService.save('/users/signin',
        {
          name,
          password
        }
      ).then(async (r) => {
        const {id, name, jwtToken, company, post} = r.data;
        await AsyncStorage.setItem("token", jwtToken);
        await AsyncStorage.setItem("id", id);
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("company", String(company.id))
        post == ('' || null || undefined) ? '' : await AsyncStorage.setItem("post", post.id);
        var starDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
        if(jwtToken){
          await AsyncStorage.setItem("startDate", starDate);
          await navigation.navigate("CheckList");
        }
      }).catch(async (e) => {
        await navigation.navigate("Login");
        setLoading(false)
        Alert.alert(`Usuário ${email}`, 'Email ou senha incorretas');
      })
    
    return data;  
  }

  return (
    <View style={styles.container}>
      <Image 
        source={eskimoIcone}
        style={{width: 220, height: 119, marginBottom: 15}}
      />
      <Text style={styles.textoApp}>Segurança na Mão</Text>
      <View>
        <Text style={styles.textoInput}>Usuário</Text>
        <TextInput style={styles.input} value={name} onChangeText={
          (e) => {setName(e)}
        } keyboardType='default'/>
      </View>
      <View>
        <Text style={styles.textoInput}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={
          (a) => {setPassword(a)}
        } secureTextEntry={true}/>
      </View>
      <ComponentButton title="Login" m={2} isLoading={loading} ftColor={colors.white} bgColor={colors.blue[500]} onPress={login}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4889BF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoApp: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 45
  },
  textoInput: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  },
  input: {
    width: 200,
    height: 30,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 5,
    textAlign: 'center'
  },
  botaoLogin: {
    justifyContent: 'center',
    backgroundColor: '#3B76A7',
    height: 40,
    width: 100,
    borderRadius: 5,
    marginTop: 20
  },
  textBotaoLogin: {
    textAlign: 'center',
    color: '#fff'
  }
});