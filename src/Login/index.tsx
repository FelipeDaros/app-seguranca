import { StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from "react";
import CrudService from "../services/crudService";
import logo from '../../assets/logo.png'
import dayjs from "dayjs";
import * as Location from 'expo-location';
import ComponentButton from "../components/Button";
import { 
  useTheme, 
  Text as NativeBaseText, 
  VStack, Input as NativeBaseInput, Center, Heading 
} from "native-base";
import { ComponentInput } from "../components/Input";

const SIZE = 160;


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
        Alert.alert(`Usuário ${name}`, 'Usuário ou senha incorretas');
      }).finally(() => setLoading(false))
    
    return data;  
  }

  return (
    <VStack  
      backgroundColor="gray.500" 
      flex={1}
      justifyContent="center"
    >
      <Center mb="1/6">
        <Image 
          source={logo}
          style={{width: SIZE, height: SIZE}}
        />
      </Center>
      <Heading 
          color="white" 
          fontFamily="heading"
          textAlign="center"
          fontWeight="bold"
          fontSize="3xl"
          mb="10"
        >
          Segurança na mão
      </Heading>
      <VStack>
        <NativeBaseText 
          color="white" 
          fontFamily="heading"
          textAlign="center"
          fontSize="lg"
          fontWeight="bold"
        >
          Usuário
        </NativeBaseText>
        <ComponentInput 
          mx="16"
          my="4"
          h={10}
          value={name} 
          onChangeText={
            (e) => {setName(e)}
          }
          fontSize={16}
          textAlign="center"
        />
      </VStack>
      <VStack>
      <NativeBaseText 
          color="white" 
          fontFamily="heading"
          textAlign="center"
          fontSize="lg"
          fontWeight="bold"
        >
          Senha
        </NativeBaseText>
        <ComponentInput 
          mx="16"
          my="4"
          h={10}
          value={password} onChangeText={
            (a) => {setPassword(a)}
          }
          textAlign="center"
          secureTextEntry
        />
      </VStack>
      <ComponentButton 
        title="Entrar" 
        mx="1/3" 
        fontWeight="bold"
        isLoading={loading} 
        color="white" 
        bgColor="gray.600"
        onPress={login}
      />
    </VStack>
  )
}