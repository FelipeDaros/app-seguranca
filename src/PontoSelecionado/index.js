import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import { BarCodeScanner } from 'expo-barcode-scanner';
import dayjs from "dayjs";
import * as Location from 'expo-location';


export default function PontoSelecionado(props){
  const crudService = new CrudService();
  const [data, setData] = useState('');
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    listarPontoSelecionado();

    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, [])

  

  async function listarPontoSelecionado(){
    try {
      var t = await crudService.findOne('/service-point/', props.route.params.id);
      setData(t.data);
    } catch (error) {
      console.log(error.respose)
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    let location = await Location.getCurrentPositionAsync({});
    const id = await AsyncStorage.getItem("id");
    setLocation(location);
    const {coords} = location
    setScanned(true);
    console.log({
      user_id: id,
      point_id: props.route.params.id,
      locale: data,
      data: dayjs().format(),
      latitude: Number(coords.latitude),
      longitude: Number(coords.longitude)
    })
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
      
    }
  };

  return(
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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