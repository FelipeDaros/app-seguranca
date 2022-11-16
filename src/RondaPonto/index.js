import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from '../services/crudService';
import ComponentButton from "../components/Button";
import { useTheme } from "native-base";

export default function RondaPonto({ navigation }){
  const {colors} = useTheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [textoSetor, setTextoSetor] = useState('');
  const crudService = new CrudService();

  async function localizacao(){
    let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const company = await AsyncStorage.getItem("company");
      const {coords} = location
      console.log(String(coords.longitude))
      await crudService.save('https://backend-seguranca.herokuapp.com/api/service-point',
      {
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      locale: textoSetor.toUpperCase(),
      company_id: company
      }).then(r => {
        setLocation(null);
        setTextoSetor('');
        Alert.alert('Ponto Cadastrado!', 'Você acabou de cadastrar o ponto no setor '+textoSetor);
      }).catch((err) => {
        console.log(err)
      })
  }

  return(
    <View style={styles.container}>
      <Text style={styles.textoPonto}>Cadastro Ponto</Text>
      <Text style={styles.textoInformacao}>Para utilizar o cadastro do ponto você terá que ir até o local desejado e apertar para cadastrar, após o cadastro você poderá imprimir o QRCODE gerado para fixar no local do ponto cadastrado.</Text>
      <Text style={styles.textoSetor}>Informe o setor</Text>
      <TextInput style={styles.input} value={textoSetor} onChangeText={e => setTextoSetor(e)}/>
      <ComponentButton bgColor={colors.green[700]} title="Cadastrar" ftColor={colors.white} onPress={localizacao} m={2}/>
    </View>
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