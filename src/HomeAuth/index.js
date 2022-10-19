import { Alert, Vibration, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import React, {useState, useEffect} from "react";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import alert from '../../assets/alert.png';
import point from '../../assets/point.png';
import round from '../../assets/round.png';
import registerPoint from '../../assets/registerPoint.png';
import regiserOccurence from '../../assets/regiserOccurence.png';
import panic from '../../assets/panic.png';
import CrudService from "../services/crudService";
import dayjs from "dayjs";


export default function HomeAuth({navigation}){
  const ONE_SECOND_IN_MS = 500;
  const crudService = new CrudService();
  const [alertText, setAlertText] = useState([]);
  const [dataAlert, setDataAlert] = useState();

  useEffect(() => {
    alertTime();
  }, []);

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
      console.log(error)
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
          await AsyncStorage.multiRemove(["jwtToken", "id", "name"]).then(() => {
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

  setTimeout(() => {
    alertText.map(e => {
      setDataAlert(e.latestAlert);
    })
  }, 1000)

  async function alertTime(){
    const id = await AsyncStorage.getItem("id");
    try {
      var c = await crudService.findOne('time-alert/', id);
      setAlertText(c.data);
    } catch (error) {
      setAlertText(error.response.data);
    }

  }
  

  async function alertaVigia(){
    const user_id = await AsyncStorage.getItem("id");
    const company_id = await AsyncStorage.getItem("company");
    const horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss');

    var ultimaD = dayjs(dataAlert).get("day");
    var ultimaH = dayjs(dataAlert).get("hour");
    var ultimaM = dayjs(dataAlert).get("minute");
    var horarioAtualD = dayjs(horarioAtual).get("day");
    var horarioAtualH = dayjs(horarioAtual).get("hour");
    var horarioAtualM = dayjs(horarioAtual).get("minute");

    if(ultimaM +4 <= horarioAtualM){
      Alert.alert("Alerta", "Está na HORA!");
      try {
        await crudService.save('time-alert', {
          user_id,
          company_id,
          latestAlert: horarioAtual
        }).then(() => {
          setTimeout(() => {
            alertTime()
          }, 1000)
        })
      } catch (error) {
        console.log(error.response.data);
      }
    }else if(horarioAtualM > ultimaM +4){
      Alert.alert("Alerta", "Está Já passou da hora");
    }else{
      Alert.alert("Alerta", "O horário está incorreto, não está na hora!");
    }
    
    


  }

  return(
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        <TouchableOpacity style={styles.card} onPress={alertaVigia}>
          <Image source={alert} style={styles.imgCard}/>
          <Text style={{fontSize: 9, color: '#fff'}}>{dataAlert}</Text>
          <Text style={styles.textTitleCard}>ALERTA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rondaListaPonto} style={styles.card}>
        <Image source={round} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>RONDA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ativarPanico} style={styles.card}>
        <Image source={panic} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>BOTÃO PÂNICO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ocorrencia} style={styles.card}>
        <Image source={regiserOccurence} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>REGISTRO DE OCORRÊNCIA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
        <Image source={point} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>MANDAR LOCALIZAÇÃO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rondaPonto} style={styles.card}>
        <Image source={registerPoint} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>CADASTRO PONTO</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity onPress={sair} style={styles.buttonExit}>
          <Text style={styles.textExit}>SAIR</Text>
        </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4889BF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    height: 70,
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    padding: 20
  },
  imgCard: {
    height: 45, 
    width: 45
  },
  textTitleCard: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonExit:{
    height: 25,
    width: 100,
    margin: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textExit: {
    fontSize: 20,
    color: '#fff'
  }
});
/*
var ultimaDataH = dayjs(dataAlert).get("hour");
    var ultimaDataM = dayjs(dataAlert).get("minute");
    var proximoM = ultimaDataM + 2

    if(proximoM + 1 <= dayjs().format('mm')){
      Alert.alert("ALERTA ATRASADO", "Você passou do horário previsto para o alert!");
    }
    
    if(proximoM >= dayjs().format('mm') && ultimaDataH+3 >= dayjs().format('HH')){
      Alert.alert("Ponto Alerta", "Não está no horário ainda!");
    }else{
      setProximoAlert(ultimaDataM+1);
      console.log("Está na hora!");
      try {
        await crudService.save('time-alert', {
          user_id,
          company_id,
          latestAlert
        }).then(() => {
          setTimeout(() => {
            alertTime()
            alertText.map(e => {
              setDataAlert(e.latestAlert);
            })
          }, 2000)
        })
      } catch (error) {
        console.log(error.response.data);
      }
    }*/