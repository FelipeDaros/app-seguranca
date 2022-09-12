import { Alert, Vibration, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
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

export default function HomeAuth({navigation}){
  const ONE_SECOND_IN_MS = 500;
  const crudService = new CrudService();

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
    await AsyncStorage.multiRemove(["jwtToken", "id", "name"]).then(() => {
      navigation.navigate("Login");
    });
  }

  return(
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        <TouchableOpacity style={styles.card}>
          <Image source={alert} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>ALERTA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rondaListaPonto} style={styles.card}>
        <Image source={round} style={styles.imgCard}/>
          <Text style={styles.textTitleCard}>RONDA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
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
    height: 80,
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
  }
});