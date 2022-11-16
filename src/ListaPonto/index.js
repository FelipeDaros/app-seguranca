import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CrudService from '../services/crudService'; 
import ComponentButton from "../components/Button";
import { useTheme } from "native-base";



export default function RondaListaPonto({navigation}) {
  const [data, setData] = useState('');
  const {colors} = useTheme();

  const crudService = new CrudService();
  useEffect(() => {
    roundsUser();
  },[]);

  const roundsUser = async() => {
    const id = await AsyncStorage.getItem("id");
    const post_id = await AsyncStorage.getItem("post")
    
    
    try {
      const respose = await crudService.findAll(`/service-point/point/${post_id}`);
      setData(respose.data);
      console.log(respose.data);

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
          <Text style={styles.itemTexto}>Local</Text>
          <Text style={styles.itemTexto}>{item.locale}</Text>
        </View>
        <ComponentButton bgColor={colors.lightBlue[500]} m={4} title="Validar" onPress={() => {Ponto(item.id)}} key={item.id}/>
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
          showsVerticalScrollIndicator={false}
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
  buttonValidarAtivo: {
    width: 60,
    height: 40,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10
  },
  buttonValidarDesativado: {
    width: 60,
    height: 40,
    backgroundColor: '#a62519',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10
  }
});