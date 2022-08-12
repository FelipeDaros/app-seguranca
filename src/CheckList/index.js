import { View, StyleSheet, Text, Button, FlatList, TouchableOpacity, Alert  } from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from 'expo-checkbox';
import CrudService from "../services/crudService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";




export default function Login({ navigation }) {
  const [checkBoxLeitura, setCheckLeitura] = useState(false);
  const [checkIten, setCheckIten] = useState([]);
  const [dados, setDados] = useState([]);
  const [itens, setItens] = useState([]);
  const crudService = new CrudService()

  var t = [dados];

  useEffect(() => {
    searchLatestCheckList();
    
  }, [])

  async function searchLatestCheckList(){
    /*await crudService.findAll('/service-day/latest').then((r) => {
      setDados(r.data);
    }).catch(e => {
      console.log(e)
    })*/
    try {
      const response = await crudService.findAll('/service-day/latest');
      setDados(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  

  const listItens = ({item}) => (
    <View>
      <Text style={styles.textoCheckBox}>{item.name}</Text>
    </View>
  )

  const startDayService = async () => {
    if(checkBoxLeitura == false){
      Alert.alert("Leitura do relatório", "Você não confirmou a leitura do relatório deseja proseguir ?", [
        {
          text: 'Aceitar',
          onPress: async () => {
            const id = await AsyncStorage.getItem("id");
            var nameItens = [];

            itens.map(e => nameItens.push(e.name));
            await crudService.save("/service-day", {
              user_id: id,
              itens: nameItens,
              post_id: "2850c05f-54ee-483c-959d-252cf2e51e40",
              created_at: dayjs().format(),
              report_reading: checkBoxLeitura == true ? 1 : 0
            }).then(async (e) => {
              console.log(e.data)
              await navigation.navigate("HomeAuth")
            }).catch(e => {
              console.log(e);
              return
            })
          }
        },
        {
          text: 'Cancelar',
          onPress: () => {return}
        }
      ])
    }
    if(checkBoxLeitura == true){
      await navigation.navigate("HomeAuth")
    }
  }

  const listAllItens = ({item, index}) => (
    <View style={styles.continerCheckBoxRow}>
      <Checkbox
        value={checkIten.find(iten => iten.id === item.id ? true : false)}
        key={item.id}
        color={setCheckIten ? '#000' : '#CEE0EF'}
        onValueChange={() => {
          handleListTap(item)
        }}
      />
      <Text style={styles.textoCheckBox}>{item.name}</Text>
    </View>
  )

  const handleListTap = (item) => {
    let itenId = [...checkIten];   // add this
    const index = itenId.indexOf(item);
     if (index > -1) {
      itenId.splice(index, 1);    // add this
     } else {
      itenId.push(item); // add this
     }
    setCheckIten(itenId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textoContainer}>CHECK LIST</Text>
      {dados <= (dados.length == 0) ? <></> :
        
        <View style={styles.containerCheckList}>
          <Text style={styles.textoContainer}>Marque os equipamentos</Text>
          <View style={styles.containerCheckListItens}>
          <FlatList 
            data={itens}
            renderItem={listAllItens}
            keyExtractor={(item) => item.id}
            />
          </View>
          <Text style={styles.textoContainer}>Equipamentos do Vigilante Anterior</Text>
          <FlatList 
          data={itens}
          renderItem={listItens}
          />
        <Text style={styles.textoContainer}>Local: {dados.post_id.name}</Text>
        <Text style={styles.textoContainer}>Último posto {dados.created_at}</Text>
        <Text style={styles.textoContainer}>{dados.report_reading == 1 ? <Text>Foi confirmado que foi lido</Text>: <Text>Não foi confirmado que foi lido</Text>}</Text>
        <View style={styles.containerCheckBox}>
          <Text>Concordo que li o relatório</Text>
          <Checkbox 
            value={checkBoxLeitura}
            onValueChange={setCheckLeitura}
            style={{marginTop: 20}}
          />
        </View>
        
        <TouchableOpacity style={styles.botao} onPress={startDayService}>
          <Text style={styles.textoBotao}>Iniciar</Text>
        </TouchableOpacity>
      </View>
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4889BF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCheckListItens:{
    height: 'auto',
    width: 350,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerCheckList: {
    height: 'auto',
    width: 350,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoContainer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CEE0EF',
    textAlign: 'center',
    margin: 6
  },
  continerCheckBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5
  },
  textoCheckBox: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
    textTransform: 'uppercase'
  },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B76A7',
    width: 120,
    height: 40,
    borderRadius: 5,
    margin: 20
  },
  textoBotao: {
    color: '#fff',
    fontSize: 22
  },
  containerCheckBox: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  }
});