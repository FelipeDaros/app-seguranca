import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import { BarCodeScanner } from 'expo-barcode-scanner';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as Location from 'expo-location';


export default function PontoSelecionado(props){
  const crudService = new CrudService();
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasPermissionBarCode, setHasPermissionBarCode] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    listarPontoSelecionado();

    const getLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Não foi autorizado o acesso a locailização');
        return;
      }
    }

    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermissionBarCode(status === 'granted');
    };

    getBarCodeScannerPermissions();
    getLocationPermissions();
  }, [])

  
  

  async function listarPontoSelecionado(){
    try {
      var t = await crudService.findOne('/service-point/', props.route.params.id);
      setData(t.data);
    } catch (error) {
      console.log(error.respose)
    }
  }

  if (hasPermissionBarCode === null) {
    return <Text style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>Requesting for camera permission</Text>;
  }
  if (hasPermissionBarCode === false) {
    return Alert.alert('Você não deu permisão para acessar a câmera');
  }

  async function enviarQRCODE(){
    let location = await Location.getCurrentPositionAsync({});
    const id = await AsyncStorage.getItem("id");
    setLocation(location);
    const {coords} = location
    dayjs.extend(utc);
    try {
      await crudService.save('/round', {
        user_id: id,
        point_id: props.route.params.id,
        locale: text,
        data: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude)
      }).then(async () => {
        await props.navigation.navigate('RondaListaPonto');
      })
    } catch (error) {
      var err = error.response.data
      Alert.alert('Ocorreu um erro!', `${err.error}`);
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setText(data);
    setScanned(true);
    scanned == true ? setIsActive(false) : setIsActive(true);
  };
 
  return(
    <View style={styles.container}>
      {isActive && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.QRCODE}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          type={BarCodeScanner.Constants.Type.back}
        />
      )}
      {isActive == true ? 
        <TouchableOpacity onPress={() => setIsActive(false)} style={styles.button}>
          <Text style={{color: '#fff'}}>Fechar</Text>
        </TouchableOpacity> 
        : 
        <TouchableOpacity onPress={() => setIsActive(true)} style={styles.button}>
          <Text style={{color: '#fff'}}>Scanner</Text>
        </TouchableOpacity>
        }
        {text != '' || null || undefined ? <TouchableOpacity onPress={enviarQRCODE} style={styles.buttonSend}>
            <Text style={{color: '#fff'}}>ENVIAR</Text>
          </TouchableOpacity> : <></>
          
        }
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
  QRCODE: {
    height: 350,
    width: 350
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B76A7',
    height: 40,
    width: 100,
    borderRadius: 5,
    margin: 10
  },
  buttonSend: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24a31d',
    height: 40,
    width: 100,
    borderRadius: 5,
    margin: 10
  }
});