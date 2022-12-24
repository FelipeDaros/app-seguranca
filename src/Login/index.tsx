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
import api from "../api/api";
import { useNavigation } from "@react-navigation/native";

const SIZE = 160;


export default function Login({ navigation }){
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const crudService = new CrudService();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigation();

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
    const data = await api.post('/auth',
        {
          name,
          password
        }
      ).then(async (response) => {
        const {token, id, post_id} = response.data;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user_id", id);
        await AsyncStorage.setItem("post_id", post_id);
        navigate.navigate("CheckList");
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