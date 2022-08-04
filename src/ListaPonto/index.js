import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Image, Alert } from "react-native";
import CrudService from '../services/crudService';
import iconeRefresh from '../../assets/refresh-icon-10853.png';
import IconeOff from '../../assets/icons8-off-47.png';
import IconeOn from '../../assets/icons8-on-47.png';


export default function RondaListaPonto() {
  const [data, setData] = useState('');
  const [dados, setDados] = useState([]);
  const t = [data];
   
  useEffect(() => {
    roundsUser();
  },[]);

  const roundsUser = async() => {
    const crudService = new CrudService
    const id = await AsyncStorage.getItem("id");

    await crudService.findAllRoundUser('/round', {
      user_id: id
    }).then((d) => {
      setData(d.data);
      //console.log(d.data)
    }).catch(e => {
      console.log(e);
    });
    t.map((e) => {
      Object.values(e).forEach(item =>{
        setDados(item);
    });
    })};



  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.viewCard}>
        <View>
          <Text style={styles.itemTexto}>Local: {item.point_id.locale}</Text>
          <Text style={styles.itemTexto}>Responsável: {item.user_id.name}</Text>
        </View>
        {item.stats == true ? 
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textoTitulo}>LUGARES DA SUA RONDA</Text>
      {dados <= (dados.length == 0) 
      ? <TouchableOpacity onPress={roundsUser} style={styles.botaoAtualizar}>
          <Text style={styles.textoAtualizar}>Atualizar</Text>
          <Image
            source={iconeRefresh}
            style={styles.icone}
          />
        </TouchableOpacity>
      : <View style={styles.viewFlatList}>
        <FlatList 
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{height: 250}}
          />
        </View>
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#d13f3f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoTitulo:{
    fontSize: 20, 
    color: '#fff', 
    fontWeight: 'bold', 
    margin: 25
  },
  viewFlatList: {
    height: 400
  },
  card:{
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 300,
    height: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  viewCard: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemTexto: {
    margin: 5,
    color: '#fff',
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
    color: '#000',
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
  }
});