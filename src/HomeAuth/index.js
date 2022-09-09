import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Vibration, Alert, Image, TextInput } from "react-native";
import React, {useState, useEffect} from "react";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import dayjs from "dayjs";
import alertaIcone from '../../assets/emergency-icon.webp';
import salvarPontoIcone from '../../assets/checkmark-map-location-icon.webp';
import localizacaoIcone from '../../assets/location-information-icon.png';
import rondaIcone from '../../assets/security-guard-icon.png';
import cadastrarOcorrenciaIcone from '../../assets/enrollment-icon.png';
import alertaVigiaIcone from '../../assets/checkmark-bell-notification-icon.webp';
import iconeLupa from '../../assets/search-icon-png-9993.png';
import eskimoLogo from '../../assets/logo.png';


export default function HomeAuth({navigation}){
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const crudService = new CrudService();
  const [nome, setNome] = useState('');
  const ONE_SECOND_IN_MS = 500;
  const [alert, setAlert] = useState(0);
  const [proximoAlerta, setProximoAlerta] = useState('');
  const [ultimoAlerta, setUltimoAlerta] = useState('');
  
  function addMinutes(date){
    var date = dayjs(date).add(30, 'seconds').format();
    return date;
  }

  async function mandarLocalizacao(){

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    const {latitude, longitude} = location.coords;
    const user_id = await AsyncStorage.getItem("id");
    const dataAtual = dayjs().format('YYYY-MM-DD HH:mm:ss')

    crudService.save('/location', {
      latitude: String(latitude),
      longitude: String(longitude), 
      date: dataAtual, 
      user_id
    }).then((r) => {
      Alert.alert('Você mandou a sua localização', 'Localização Eviada!');
      Vibration.vibrate(1*ONE_SECOND_IN_MS);
    }).catch(e => {
      console.log(e);
    })
  }

  async function ativarPanico(){
    const date = dayjs(Date.now());
    const id = await AsyncStorage.getItem("id");
    crudService.save('/panic',{
      user_id: id,
      stats: 1,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }).then(() => {
      Alert.alert('Você ativou o botão do PÂNICO!', 'ALERTA PÂNICO');
      Vibration.vibrate(1*ONE_SECOND_IN_MS);
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
    navigation.navigate('RondaPonto');
  }

  function Ocorrencia(){
    navigation.navigate('Ocorrencia');
  }

  function rondaListaPonto(){
    navigation.navigate('RondaListaPonto');
  }

  async function alertF(){
    var startDate = await AsyncStorage.getItem("startDate");
    if(alert == 0){
      setAlert(1);
      setProximoAlerta(addMinutes(startDate));
      setUltimoAlerta(dayjs().format())
    }

    if(alert >= 1 && dayjs().format() > proximoAlerta){
      setAlert(alert+1);
      setProximoAlerta(addMinutes(ultimoAlerta));
      setUltimoAlerta(dayjs().format());
    }
  }

  return(
    <View style={styles.container}>
      <Image 
      source={eskimoLogo}
      style={styles.logoEskimo}
      />
      <Text style={styles.texto}>Vigia: {nome}</Text>
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.botao} onPress={rondaPonto}>
          <Image
            style={styles.icone}
            source={salvarPontoIcone}
          />
          <Text style={styles.textoBotao}>Cadastrar um ponto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={rondaListaPonto}>
          <Text style={styles.textoBotao}>Lista Ronda</Text>
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
        <TouchableOpacity style={styles.botao} onPress={mandarLocalizacao}>
        <Image
            style={styles.icone}
            source={localizacaoIcone}
          />
          <Text style={styles.textoBotao}>Mandar Localização</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.botao} onPress={alertF}>
          <Image
            style={styles.icone}
            source={alertaVigiaIcone}
          />
          <Text style={styles.textoBotao}>Alerta Vigia</Text>
          <Text>{alert+'/'+24}</Text>
          <Text>Próximo Alerta</Text>
          <Text style={{fontSize: 10, color: '#fff'}}>{proximoAlerta}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={ativarPanico}>
        <Image
            style={styles.icone}
            source={alertaIcone}
          />
        <Text style={styles.textoBotao}>Botão Pânico</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#4889BF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoEskimo: {
    width: 180, 
    height: 100, 
    marginBottom: 20
  },
  texto: {
    fontSize: 16,
    color: '#fff'
  },  
  menuRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botao: {
    height: 100,
    width: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    height: 60, 
    width: 60
  },
  botaoRondaAtivo:{
    height: 100,
    width: 150,
    backgroundColor: 'rgba(50, 150, 45, 0.9)',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  botaoSair: {
    height: 40,
    width: 80,
    backgroundColor: '#545252',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20
  },
  textoBotaoAtivoRonda: {
    textAlign: 'center',
    fontSize: 14,
    color: 'red'
  },
});