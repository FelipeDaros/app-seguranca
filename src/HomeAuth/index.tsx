import { Alert, Vibration, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Button } from "react-native";
import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import dayjs from "dayjs";
import ComponentButton from "../components/Button";
import { useTheme, VStack } from "native-base";
import Loading from "../components/Loading";
import { createRounds } from "../services/createRounds";
import { Header } from "../components/Header";
import { Card } from "../components/Card";

type Panic = {
  user_id: string,
  stats: number,
  date: string
}

export default function HomeAuth({navigation}){
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const ONE_SECOND_IN_MS = 500;
  const crudService = new CrudService();
  const [alertData, setAlertData] = useState('');
  const [proximoAlerta, setProximoAlerta] = useState('');

  async function horario(){
    const id = await AsyncStorage.getItem("id");
    setLoading(true);
    await crudService.findOne('time-alert/', id)
    .then(e => {
    })
    .catch(error=> {
      setAlertData(error.response.data)
    }).finally(() => setLoading(false));
    
    var horarioBanco = dayjs(alertData).format('YYYY-MM-DD HH:mm:ss')
    var horarioAdd= dayjs(horarioBanco).add(4, 'hour');
    setProximoAlerta(dayjs(horarioAdd).format('YYYY-MM-DD HH:mm:ss'));
  }

  async function ativarAlerta(){
    setLoading(true);
    const user_id = await AsyncStorage.getItem("id");
    const company_id = await AsyncStorage.getItem("company");
    const horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss')
    if(proximoAlerta >= horarioAtual){
      setLoading(false);
      return Alert.alert("ALERTA", "Não está no horario ainda para fazer a ronda!");
    }else{
      try {
        createRounds();
        await crudService.save('time-alert', {
          user_id,
          company_id,
          latestAlert: horarioAtual,
          late: 0
        })
      } catch (error) {
        Alert.alert("Alerta", "HORARIO C : Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
      }
      horario();
      setLoading(false);
      await AsyncStorage.setItem("horario", horarioAtual);
      return Alert.alert("ALERTA", "Você já pode ir fazer a ronda!");
    }
  }

  async function ativarPanico(){
    const id = await AsyncStorage.getItem("id");

    const data: Panic = {
      user_id: id,
      stats: 1,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    
    try {
      crudService.save('/panic',{
        data
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
  }, [proximoAlerta, alertData]);

  return(
    <VStack bg="gray.500" flex={1}>
      <Header />
      <Card 
        
      />
    </VStack>
  )
}


