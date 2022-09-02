import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import { BarCodeScanner } from 'expo-barcode-scanner';
import dayjs from "dayjs";
import * as Location from 'expo-location';


export default function PontoSelecionado(props){
  const crudService = new CrudService();
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasPermissionBarCode, setHasPermissionBarCode] = useState(null);
  const [scanned, setScanned] = useState(false);

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

  const handleBarCodeScanned = async ({ type, data }) => {
    let location = await Location.getCurrentPositionAsync({});
    const id = await AsyncStorage.getItem("id");
    setLocation(location);
    const {coords} = location
    setScanned(true);
    try {
      await crudService.save('/round', {
        user_id: id,
        point_id: props.route.params.id,
        locale: data,
        data: dayjs().format(),
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude)
      })
    } catch (error) {
      Alert.alert('Você não está próximo ao ponto selecionado!');
      console.log(error.response.data);
    }
  };

  return(
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        type={BarCodeScanner.Constants.Type.back}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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
  }
});