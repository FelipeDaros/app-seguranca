import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import { BarCodeScanner } from 'expo-barcode-scanner';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as Location from 'expo-location';
import { roundRemoveById } from "../storage/round/roundRemoveById";
import Loading from "../components/Loading";
import ComponentButton from "../components/Button";
import { Center, Text, useTheme, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import * as Network from 'expo-network';
import { RoundSaveOffiline } from "../storage/round/roundSaveOffline";
import { Header } from "../components/Header";
import { AppError } from "../infra/error/AppError";


export default function PontoSelecionado(props){
  const [loading, setLoading] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const crudService = new CrudService();
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasPermissionBarCode, setHasPermissionBarCode] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const {colors} = useTheme();
  const navigation = useNavigation();
  

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
    return (
            <VStack bg="#4889BF" flex={1}>
              <Center>
                <Text 
                  color="white" 
                  fontFamily="heading"
                >
                  Esperando a resposta da câmera
                </Text>
              </Center>
              <Loading />
            </VStack>
          )
  }
  if (hasPermissionBarCode === false) {
    return Alert.alert('Você não deu permisão para acessar a câmera');
  }

  async function enviarQRCODE(){
    const {coords} = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    const id = await AsyncStorage.getItem("id");

    setLoading(true);
    try {
      await crudService.save('/round', {
        user_id: id,
        point_id: props.route.params.point_id,
        locale: text,
        data: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        latitude,
        longitude
      }).then(() => {
        roundRemoveById(props.route.params.point_id);
        navigation.goBack()
      }).finally(() => setLoading(false))
    } catch (error) {

      if(error instanceof AppError){
        Alert.alert("Não está no local", error.message);
      }else{
        Alert.alert("Ponto selecionado", error.response.data.error)
      }

      
    }

  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setText(data);
    console.log(data)
    setScanned(true);
    setLoadingScan(true);
    scanned == true ? setIsActive(false) : setIsActive(true);
  };
 
  return(
    <VStack flex={1} bg="gray.500">
      <Header />
      {isActive && (
        <Center>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.QRCODE}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            type={BarCodeScanner.Constants.Type.back}
          />
        </Center>
      )}
      {isActive == true ? 
        <Center>
          <TouchableOpacity onPress={() => setIsActive(false)} style={styles.button}>
            <Text color="white">Fechar</Text>
          </TouchableOpacity> 
        </Center>
        : 
        <Center>
          <ComponentButton 
            title="Scanner"
            color={colors.white}
            onPress={() => setIsActive(true)}
            m={2}
            w="1/2"
            isLoading={loadingScan}
            bgColor={colors.blue[700]}
          />
        </Center>
        }
        {text != '' || null || undefined ? 
        <Center>
          <ComponentButton 
            isLoading={loading} 
            bgColor={colors.green[700]} 
            title="Enviar"
            w="1/2"
            onPress={enviarQRCODE} 
            m={2}
          />
        </Center>
        : <></>  
        }
    </VStack>
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



/* const {isConnected, type} = await Network.getNetworkStateAsync();
    let location = await Location.getCurrentPositionAsync({});
    
    setLocation(location);
    const {coords} = location
    //dayjs.extend(utc);
    setLoading(true);
    try {
      await crudService.save('/round', {
        user_id: id,
        point_id: props.route.params.id,
        locale: text,
        data: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude)
      }).then(() => {
        navigation.goBack();
      });
      
    } catch (error) {
      console.log(error)
      var err = error.response.data
      Alert.alert('Ocorreu um erro!', `${err.error}`);
    }*/