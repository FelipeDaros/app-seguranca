import { Alert, Vibration, Image} from "react-native";
import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import * as Location from 'expo-location';
import dayjs from "dayjs";
import { ScrollView, useTheme, VStack } from "native-base";
import { createRounds } from "../services/createRounds";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import api from "../api/api";

export default function HomeAuth({navigation}){
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { colors } = useTheme();
  const ONE_SECOND_IN_MS = 500;
  const crudService = new CrudService();
  const [proximoAlerta, setProximoAlerta] = useState('');
  const [time, setTime] = useState('');

  async function horario(){
    const user_id = await AsyncStorage.getItem("user_id");
    const {data} = await api.get(`/time-alert/user/${user_id}`);

    const dataFormatada = dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss');
    const proximoAlerta = dayjs(data.created_at).add(1, "hours");
    const proximoAlertaFormatado = dayjs(proximoAlerta).format('YYYY-MM-DD HH:mm:ss');
    

    setProximoAlerta(proximoAlertaFormatado);
    setTime(dataFormatada);
  }

  async function ativarAlerta(){
    setLoading(true);
    
    const user_id = await AsyncStorage.getItem("user_id");

    const horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    if(proximoAlerta >= horarioAtual){
      setLoading(false);
      return Alert.alert("ALERTA", "Não está no horario ainda para fazer a ronda!");
    }else{
      try {
        createRounds();
        await api.post('time-alert', {
          user_id,
          late: false
        })
      } catch (error) {
        Alert.alert("Alerta", "HORARIO C : Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
      }
      setLoading(false);
      await AsyncStorage.setItem("horario", horarioAtual);
      horario();
      return Alert.alert("ALERTA", "Você já pode ir fazer a ronda!");
    }
  }

  async function localizacao() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location)
  }

  async function ativarPanico(){
    const id = await AsyncStorage.getItem("id");
    
    try {
      crudService.save('/panic',{
        user_id: id,
        stats: 1,
        date: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }).then(() => {
        Alert.alert('Você ativou o botão do PÂNICO!', 'ALERTA PÂNICO');
        Vibration.vibrate(1*ONE_SECOND_IN_MS);
      })
    } catch (error) {
      Alert.alert("Alerta", "Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
    }
  }

  function rondaPonto(){
    navigation.navigate('RondaPonto');
  }

  function ocorrencia(){
    navigation.navigate('Ocorrencia');
  }

  function rondaListaPonto(){
    navigation.navigate('RondaListaPonto');
  }

  async function sair(){
    Alert.alert("SAIR", "Você deseja realmente sair ?",[
      {
        text: 'SIM',
        onPress: async () => {
          await AsyncStorage.multiRemove(["jwtToken", "id", "name", "post", "company"]).then(() => {
            navigation.navigate("Login");
          });
        }
      },
      {
        text: 'NÃO',
          onPress: () => {return}
      }
    ])
  }

  useEffect(() => {
    horario();
  }, []);

  return(
    <VStack bg="gray.500" flex={1}>
      <Header />
      <ScrollView>
        <Card
          title="ALERTA VIGIA" 
          iconName="bell-ring"
          titleCenter={proximoAlerta}
          textDown="APERTE PARA EFETUAR O ALERTA"
          onPress={ativarAlerta}
        />
        <Card
          title="RONDA" 
          iconName="run"
          titleCenter="Entre para efetuar sua ronda!"
          textDown="APERTE PARA EFETUAR A RONDA"
          onPress={rondaListaPonto}
        />
        <Card
          title="PÂNICO" 
          iconName="alarm-light"
          titleCenter="Aperte para emetir o pânico"
          textDown="APERTE PARA EFETUAR EMITIR O PÂNICO"
          onPress={ativarPanico}
        />
        <Card
          title="LOCALIZAÇÃO" 
          iconName="map-marker-distance"
          titleCenter="Mande sua localização"
          textDown="APERTE PARA ENVIAR LOCALIZAÇÃO"
          onPress={localizacao}
        />
        <Card
          title="REGISTRO OCORRÊNCIA" 
          iconName="file-document-edit"
          titleCenter="Registe a ocorrência"
          textDown="APERTE PARA REGISTRAR OC"
          onPress={ocorrencia}
        />
        <Card
          title="PONTO" 
          iconName="map-marker-check"
          titleCenter="Cadastrar um ponto"
          textDown="APERTE PARA CADASTRAR O PONTO"
          onPress={rondaPonto}
        />
      </ScrollView>
    </VStack>
  )
}


