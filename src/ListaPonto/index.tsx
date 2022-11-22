import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { HStack, useTheme, VStack } from "native-base";
import ComponentButton from "../components/Button";
import dayjs from "dayjs";
import { ROUND_COLLECTION } from "../storage/storageConfig";
import * as Network from 'expo-network';


interface IData{
  id: string;
  locale: string;
  name: string;
  stats: string;
}

export default function RondaListaPonto({navigation}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IData[]>([]);
  const {colors} = useTheme();

  const roundsUser = async() => {
    const {isConnected, type} = await Network.getNetworkStateAsync();
    console.log(isConnected ? "Você está conectado" : "Você está offline!");
    try {
      const rounds = await AsyncStorage.getItem(ROUND_COLLECTION);
      setData(JSON.parse(rounds));
      setLoading(false);
      //console.log(JSON.parse(rounds));

    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function Ponto(id: string){
    const horario = await AsyncStorage.getItem("horario");
    const horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss')
    setLoading(true);
    console.log(horario)
    if(horarioAtual >= horario){
      await navigation.navigate("PontoSelecionado", {id});
    }else{
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <HStack>
        <VStack>
          <Text style={styles.itemTexto}>Local</Text>
          <Text style={styles.itemTexto}>{item.locale}</Text>
        </VStack>
        <ComponentButton bgColor={colors.lightBlue[500]} isLoading={loading} ftColor="white" m={4} title="Validar" onPress={() => {Ponto(item.id)}} key={item.id}/>
      </HStack>
    </View>
  );

  useEffect(() => {
    roundsUser();
  },[loading, data]);

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
    justifyContent: 'space-between',
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