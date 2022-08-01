import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import dayjs from "dayjs";
import alertaIcone from '../../assets/emergency-icon.webp';
import salvarPontoIcone from '../../assets/checkmark-map-location-icon.webp';
import localizacaoIcone from '../../assets/location-information-icon.png';
import rondaIcone from '../../assets/security-guard-icon.png';
import cadastrarOcorrenciaIcone from '../../assets/enrollment-icon.png';
import alertaVigiaIcone from '../../assets/checkmark-bell-notification-icon.webp';


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
      Alert.alert('Você ativou o botão do PÂNICO!', 'ALERTA PÂNICO');
    }).catch(err => {
      console.log(err);
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
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.botao} onPress={ativo}>
        <Image
            style={styles.icone}
            source={rondaIcone}
          />
          <Text style={styles.textoBotao}>Ativar Ronda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={rondaPonto}>
        <Image
            style={styles.icone}
            source={salvarPontoIcone}
          />
          <Text style={styles.textoBotao}>Cadastrar um ponto</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.botao} onPress={Ocorrencia}>
        <Image
            style={styles.icone}
            source={cadastrarOcorrenciaIcone}
          />
          <Text style={styles.textoBotao}>Cadastrar Ocorrência</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao}>
        <Image
            style={styles.icone}
            source={localizacaoIcone}
          />
          <Text style={styles.textoBotao}>Mandar Localização</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.botao}>
          <Image
            style={styles.icone}
            source={alertaVigiaIcone}
          />
          <Text style={styles.textoBotao}>Alerta Vigia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={ativarPanico}>
        <Image
            style={styles.icone}
            source={alertaIcone}
          />
        <Text style={styles.textoBotao}>Botão Pânico</Text>
      </TouchableOpacity>
      </View>

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
  menuRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botao: {
    height: 100,
    width: 150,
    backgroundColor: '#4da7db',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textoBotao: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff'
  },
  icone: {
    height: 70, 
    width: 70
  }
});