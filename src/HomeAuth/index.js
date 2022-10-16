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
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'

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
    console.log(JSON.stringify(alertText))
    
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

  async function alertTime(){
    const id = await AsyncStorage.getItem("id");
    try {
      var c = await crudService.findOne('time-alert/', id);
      setAlertText(c.data);
    } catch (error) {
      setAlertText(error.response.data);
    }

  }
  

  const listAlert = ({item}) => (
    <View>
      <Text style={{fontSize: 9}}>Ultima:{item.latestAlert}</Text>
      <Text style={{fontSize: 9}}>Proxíma:{item.latestAlert}</Text>
    </View>
  )

  async function alertaVigia(){
    const user_id = await AsyncStorage.getItem("id");
    const company_id = await AsyncStorage.getItem("company");
    const latestAlert = dayjs().format('YYYY-MM-DD HH:mm:ss');
    alertText.map(e => {
      setDataAlert(e.latestAlert);
    })
    
    try {
      await crudService.save('time-alert', {
        user_id,
        company_id,
        latestAlert
      }).then(() => {
        setTimeout(() => {

          var h = dayjs(dataAlert).get('hours');
          var m = dayjs(dataAlert).get('minutes');
          var s = dayjs(dataAlert).get('seconds');
          console.log(h+3)
          alertTime()
        }, 2000)
      })
    } catch (error) {
      console.log(error.response.data);
    }


  }

  return(
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        <TouchableOpacity style={styles.card} onPress={alertaVigia}>
          <Image source={alert} style={styles.imgCard}/>
          <FlatList 
            data={alertText}
            renderItem={listAlert}
          />
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