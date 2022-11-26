import { Alert, Vibration, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Button } from "react-native";
import React, {useState, useEffect} from "react";
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
import Loading from "../components/Loading";
import { ROUND_COLLECTION } from "../storage/storageConfig";
import { createRounds } from "../services/createRounds";

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
    <View style={styles.container}>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        {loading ? 
        <TouchableOpacity style={styles.card}>
          <Loading />
        </TouchableOpacity> 
        : 
        <TouchableOpacity style={styles.card} onPress={ativarAlerta}>
          <Image source={alert} style={styles.imgCard}/>
          <View>
            <Text style={{fontSize:12, color: '#fff'}}>Próximo HORA: {proximoAlerta}</Text>
          </View>
        </TouchableOpacity>}
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

