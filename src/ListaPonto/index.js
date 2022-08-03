import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Image } from "react-native";
import CrudService from '../services/crudService';
import iconeRefresh from '../../assets/refresh-icon-10853.png';

export default function RondaListaPonto() {

  const [data, setData] = useState('');
  const [dados, setDados] = useState('');

  

  const t = [data];

  
  
  async function findUser() {
    const crudService = new CrudService
    const id = await AsyncStorage.getItem("id");

    await crudService.findAllRoundUser('/round', {
      user_id: id
    }).then((d) => {
      setData(d.data);
    }).catch(e => {
      console.log(e);
    });
    t.map((e) => {
      Object.values(e).forEach(item =>{
        setDados(item)
        console.log(dados.user_id);
      });
    })

    return
  }

  function teste(){
    console.log(dados);
  }


  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={findUser} style={{margin:30}}>
        <Image 
          source={iconeRefresh}
          style={{height: 70, width: 150}}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={teste} style={{margin:30}}>
        <Image 
          source={iconeRefresh}
          style={{height: 70, width: 150}}
        />
      </TouchableOpacity>
      <Text>{dados.id}</Text>
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
  }
});