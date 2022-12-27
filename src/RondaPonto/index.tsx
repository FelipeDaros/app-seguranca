import { Alert, StyleSheet, TextInput } from "react-native";
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from '../services/crudService';
import ComponentButton from "../components/Button";
import { Center, useTheme, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import api from "../api/api";
import { GetCompanyUser } from "../services/GetCompanyUser";

export default function RondaPonto(){
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [textoSetor, setTextoSetor] = useState('');
  const crudService = new CrudService();
  const navigation = useNavigation();

  async function localizacao(){
    let {coords} = await Location.getCurrentPositionAsync();
    setLocation(location);
    setLoading(true);

    const {company_id} = await GetCompanyUser();

    await api.post('/point',{
    latitude: Number(coords.latitude),
    longitude: Number(coords.longitude),
    name: textoSetor,
    company_id
    }).then(r => {
    setLocation(null);
    setTextoSetor('');
    navigation.goBack();
    Alert.alert('Ponto Cadastrado!', 'Você acabou de cadastrar o ponto no setor '+textoSetor);
    }).catch((err) => {
      console.log(err)
      Alert.alert("Ponto", err.response.data.error);
    }).finally(() => setLoading(false))
  }

  return(
    <VStack flex={1} bg="gray.500">
      <Header />
      <Center mt="1/3">
        <Text fontFamily="heading" color="white">Cadastro Ponto</Text>
        <Text fontFamily="body" color="white" px="12" textAlign="center">Para utilizar o cadastro do ponto você terá que ir até o local desejado e apertar para cadastrar, após o cadastro você poderá imprimir o QRCODE gerado para fixar no local do ponto cadastrado.</Text>
        <Text color="white" fontFamily="heading" mt="6">Informe o setor</Text>
        <TextInput style={styles.input} value={textoSetor} onChangeText={e => setTextoSetor(e)}/>
      </Center>
      <Center>
        <ComponentButton 
          bgColor={colors.green[700]} 
          title="Cadastrar"
          m={2}
          w="1/2"
          onPress={localizacao}
          isLoading={loading}
        />
      </Center>
    </VStack>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#4889BF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoPonto: {
    textAlign: 'center',
    fontSize: 30,
    color: '#CEE0EF'
  },
  textoInformacao:{
    textAlign: 'center',
    width: 350,
    color: '#CEE0EF',
    margin: 30
  },
  botao: {
    height: 60,
    width: 200,
    backgroundColor: '#3d916a',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textoBotao:{
    fontSize: 18,
    color: '#CEE0EF'
  },
  input: {
    width: 200,
    height: 30,
    backgroundColor: '#CEE0EF',
    margin: 15,
    borderRadius: 5,
    textAlign: 'center'
  },
  textoSetor: {
    color: '#CEE0EF', 
    fontWeight: 'bold', 
    fontSize: 16
  }
});