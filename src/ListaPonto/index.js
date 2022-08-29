import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Image, Alert } from "react-native";
import CrudService from '../services/crudService';
import iconeRefresh from '../../assets/refresh-icon-10853.png';
import IconeOff from '../../assets/icons8-off-47.png';
import IconeOn from '../../assets/icons8-on-47.png';
import { BarCodeScanner } from 'expo-barcode-scanner';



export default function RondaListaPonto({navigation}) {
  const [data, setData] = useState('');

  const crudService = new CrudService();
  useEffect(() => {
    roundsUser();
  },[]);

  const roundsUser = async() => {
    const id = await AsyncStorage.getItem("id");
    const company_id = await AsyncStorage.getItem("company")
    try {
      const respose = await crudService.findAll(`/service-point/company/${company_id}`);
      setData(respose.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function Ponto(id){

    await navigation.navigate("PontoSelecionado", {id});
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.viewCard}>
        <View>
          <Text style={styles.itemTexto}>Local: {item.locale}</Text>
        </View>
        {item.stats == "A" ? 
        <Image 
        source={IconeOff}
        style={styles.iconeStats}
        />
        :
        <Image 
          source={IconeOn}
          style={styles.iconeStats}
        />
        }
        <TouchableOpacity style={styles.buttonValidar} onLongPress={async () => {
          Ponto(item.id)
        }} key={item.id}>
          <Text style={styles.itemTexto}>Validar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textoTitulo}>Lista os pontos para efetuar as rotas</Text>
        <FlatList 
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{height: 250}}
        />
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
  textoTitulo:{
    fontSize: 20, 
    color: '#CEE0EF', 
    fontWeight: 'bold', 
    margin: 30,
    marginTop: 60
  },
  viewFlatList: {
    height: 400
  },
  card:{
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 300,
    height: 80,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  viewCard: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  itemTexto: {
    margin: 5,
    color: '#CEE0EF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  botaoAtualizar: {
    width: 100,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderRadius: 5
  },
  textoAtualizar: {
    fontSize: 18,
    color: '#CEE0EF',
    fontWeight: 'bold'
  },
  icone: {
    width: 60,
    height: 40
  },
  iconeStats: {
    width: 35,
    height: 35,
    margin: 5
  },
  buttonValidar: {
    width: 60,
    height: 40,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10
  }
});