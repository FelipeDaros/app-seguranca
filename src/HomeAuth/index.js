import { Alert, Vibration, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Button } from "react-native";
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
import ComponentButton from "../components/Button";
import { useTheme } from "native-base";


export default function HomeAuth({navigation}){
  const { colors } = useTheme();
  const ONE_SECOND_IN_MS = 500;
  const crudService = new CrudService();
  const [alertText, setAlertText] = useState([]);
  const [dataAlert, setDataAlert] = useState();
  const [proximoAlerta, setProximoAlerta] = useState();

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

    try {
      await crudService.findOne('/time-alert/findalert/', user_id);
    } catch (error) {
      if(error.response.data.error){
        console.log("Não tem")
        try {
          await crudService.save('time-alert', {
            user_id,
            company_id,
            latestAlert: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            late: 0
          })
        } catch (error) {
          Alert.alert("Alerta", "HORARIO C : Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
          console.log(error.response.data);
        }
      }else{
        var horarioBanco = dayjs(dataAlert).format('YYYY-MM-DD HH:mm:ss');
        //console.log("HORARIO BANCO -> ",horarioBanco)

        var horarioBancoAdd = dayjs(horarioBanco).add(3, 'hour');
        
        var horarioBancoAddFormatado = dayjs(horarioBancoAdd).format('YYYY-MM-DD HH:mm:ss');
        //console.log(horarioBancoAddFormatado)
        
        //console.log("Horario Atual BANCO FORMATADO: ", horarioBancoAddFormatado);
        /*HORARIO DO BANCO -----------------------------------------------------------------*/

        var horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss');
        
        var horarioBancoProximoHorario = dayjs(horarioBancoAddFormatado).add(1, 'hour');
        var horarioBancoProximoHorarioFormatado = dayjs(horarioBancoProximoHorario).format('YYYY-MM-DD HH:mm:ss');
        setProximoAlerta(horarioBancoProximoHorarioFormatado);
        await AsyncStorage.setItem("proximoHorario", horarioBancoProximoHorarioFormatado);
        var horarioBancoProximoHorarioAddMinutos = dayjs(horarioBancoProximoHorarioFormatado).add(5, 'minute');
        var horarioBancoProximoHorarioAddMinutosFormatado = dayjs(horarioBancoProximoHorarioAddMinutos).format('YYYY-MM-DD HH:mm:ss');
        
        

        if(horarioAtual > horarioBancoProximoHorarioFormatado && horarioAtual <= horarioBancoProximoHorarioAddMinutosFormatado){
          try {
            await crudService.save('time-alert', {
              user_id,
              company_id,
              latestAlert: horarioAtual,
              late: 0
            }).then(() => {
              setTimeout(() => {
                alertTime()
              }, 1000)
            })
          } catch (error) {
            Alert.alert("Alerta", "HORARIO C : Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
            console.log(error.response.data);
          }
        }else if(horarioAtual >= horarioBancoProximoHorarioAddMinutosFormatado){
          Alert.alert("ALERTA!", "Pelo seu atraso do alerta foi gerado uma notificação");
          try {
            await crudService.save('time-alert', {
              user_id,
              company_id,
              latestAlert: horarioAtual,
              late: 0
            }).then(() => {
              setTimeout(() => {
                alertTime()
              }, 1000)
            })
          } catch (error) {
            Alert.alert("Alerta", "HORARIO C : Ocorreu um erro inesperado! Entre em contato com o T.I RAMAL 220");
            console.log(error.response.data);
          }
        }else{
          //console.log("NÃO")
          return
        }

      }
    }
    
  }

  return(
    <View style={styles.container}>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        <TouchableOpacity style={styles.card} onPress={alertaVigia}>
          <Image source={alert} style={styles.imgCard}/>
          <View>
            <Text style={{fontSize:12, color: '#fff'}}>Próximo HORA: {proximoAlerta}</Text>
          </View>
          
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
      <ComponentButton onPress={sair} m={4} title="SAIR" bgColor={colors.red[500]} ftColor={colors.white}/>
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