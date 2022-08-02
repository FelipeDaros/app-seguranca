import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from "react-native";
import CrudService from '../services/crudService';

export default function RondaListaPonto() {

  const [data, setData] = useState('');

  

  const t = [data];

  
  
  async function findUser() {
    const crudService = new CrudService
    const id = await AsyncStorage.getItem("id");

    await crudService.findAllRoundUser('/round', {
      user_id: id
    }).then((d) => {
      setData(d.data);
      console.log(d.data)
    }).catch(e => {
      console.log(e);
    });

    return
  }

  function keys(){
    const {user_id} = t;
    console.log(user_id)
  }

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={findUser} style={{margin:20}}>
        <Text>TETETE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={keys}>
        <Text>b</Text>
      </TouchableOpacity>
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