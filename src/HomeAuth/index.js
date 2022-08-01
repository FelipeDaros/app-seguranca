import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import dayjs from "dayjs";

export default function HomeAuth({navigation}){
  const crudService = new CrudService();
  const [status, setStatus] = useState('');
  const [nome, setNome] = useState('');
  
  async function ativo(){
    const id = await AsyncStorage.getItem("id");
    const findUser = await crudService.findOne('/users/', id);

    const { situation } = findUser.data;

    if(situation === "I" && status == 'Inativo'){
      crudService.update(`/users/${id}`, {
        situation: 'A'
      })
      setStatus('Ativo');
      
    }else{
      crudService.update(`/users/${id}`, {
        situation: 'I'
      })
      setStatus('Inativo');
    }
  }

  async function ativarPanico(){
    const date = dayjs(Date.now());
    const id = await AsyncStorage.getItem("id");
    crudService.save('/panic',{
      user_id: id,
      stats: "ATIVO",
      date: "01/08/202214:08:22"
    }).then(() => {
      Alert('Você ativou o botão do PÂNICO!');
    })
  }

  useEffect(() => {
    async function atualizar(){
    const id = await AsyncStorage.getItem("id");
    const data = await crudService.findOne('/users/', id);
    const {name, situation} = data.data;

    setNome(name);
    }

    atualizar();
  })


  async function sair(){
    await AsyncStorage.multiRemove(["jwtToken", "id", "name"]).then(() => {
      navigation.navigate("Login");
    });
  }

  function rondaPonto(){
    navigation.navigate('RondaPonto')
  }

  function Ocorrencia(){
    navigation.navigate('Ocorrencia')
  }

  return(
    <View style={styles.container}>
      <Text>Vigia: {nome}</Text>
      <Text>Situação: {status}</Text>
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
      <TouchableOpacity style={styles.botao} onPress={ativarPanico}>
        <Text style={styles.textoBotao}>Botão Pânico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao} onPress={sair}>
        <Text style={styles.textoBotao}>Sair</Text>
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
    height: 45,
    width: 220,
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