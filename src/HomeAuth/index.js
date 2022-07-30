import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import axios from 'axios';

export default function HomeAuth({navigation}){

  const [status, setStatus] = useState(0);
  
  function ativo(){
    if(status == 0){
      setStatus(1);
    }else{
      setStatus(0);
    }
  }

  const user = {
    name: 'USUÁRIO',
    rotas: 4,
    proximo: 'Próximo TURNO 3H'
  }

  function rondaPonto(){
    navigation.navigate('RondaPonto')
  }

  function Ocorrencia(){
    navigation.navigate('Ocorrencia')
  }

  return(
    <View style={styles.container}>
      <Text>Vigia: {user.name}</Text>
      <Text>Lugares: {user.rotas}</Text>
      <Text>Turno: {user.proximo}</Text>
      <Text>Ativo: {status}</Text>
      <TouchableOpacity style={styles.botao} onPress={ativo}>
        <Text style={styles.textoBotao}>Ativar Ronda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao} onPress={rondaPonto}>
        <Text style={styles.textoBotao}>Cadastrar um ponto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao} onPress={Ocorrencia}>
        <Text style={styles.textoBotao}>Cadastrar Ocorrência</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Mandar Localização</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Alerta Vigia</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Botão Pânico</Text>
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
  botao: {
    height: 60,
    width: 200,
    backgroundColor: '#4da7db',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textoBotao: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  }
});