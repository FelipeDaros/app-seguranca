import { View, StyleSheet, Text, Button, FlatList  } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox, Icon, ListItem } from '@rneui/themed';
import CrudService from "../services/crudService";


export default function Login({ navigation }) {
  const [checkBoxLeitura, setCheckLeitura] = useState(false);
  const [dados, setDados] = useState(['']);
  const [itens, setItens] = useState([]);
  const crudService = new CrudService;

  var t = [dados];

  useEffect(() => {
    searchLatestCheckList();
  }, [])

  async function searchLatestCheckList(){
    await crudService.findAll('/service-day/latest').then((r) => {
      setDados(r.data);
    }).catch(e => {
      console.log(e)
    })
    setItens(t.map(i => {
      i.itens
      console.log(i.itens);
    }))
  }

  return (
    <View style={styles.container}>
      <Text>Check List</Text>
      {dados <= (dados.length == 0) ? <></> :
        <View style={styles.containerCheckList}>
        <Text style={styles.textoContainer}>Local: {dados.post_id.name}</Text>
        <Text style={styles.textoContainer}>Último posto {dados.created_at}</Text>
        <Text style={styles.textoContainer}>{dados.report_reading == 1 ? <Text>Foi confirmado que foi lido</Text>: <Text>Não foi confirmado que foi lido</Text>}</Text>
      </View>
      }
      <CheckBox
          center
          title="Confirmo a leitura do relatório"
          type="material"
          color="grey"
          size={25}
          checked={checkBoxLeitura}
          onPress={() => setCheckLeitura(!checkBoxLeitura)}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d13f3f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCheckList: {
    height: 250,
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  }
});