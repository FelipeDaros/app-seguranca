import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';


export default function RondaPonto({ navigation }){

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  function localizacao(){
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const {coords} = location
      console.log(String(coords.longitude))
      await axios.post('https://backend-seguranca.herokuapp.com/api/service-point',
      {
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      locale: "teste"
      }).then(r => {
        console.log(r.data);
      }).catch((err) => {
        console.log(err)
      })
  })()
  }
  return(
    <View style={styles.container}>
      <Text style={styles.textoPonto}>Cadastro Ponto</Text>
      <Text style={styles.textoInformacao}>Para utilizar o cadastro do ponto você terá que ir até o local desejado e apertar para cadastrar, após o cadastro você poderá imprimir o QRCODE gerado para fixar no local do ponto cadastrado.</Text>
      <TouchableOpacity style={styles.botao} onPress={localizacao}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#63C6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoPonto: {
    textAlign: 'center',
    fontSize: 30,
    color: '#fff'
  },
  textoInformacao:{
    textAlign: 'center',
    width: 350,
    color: '#fff',
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
    color: '#fff'
  },
});