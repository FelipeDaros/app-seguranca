import { View, StyleSheet, Text, Button, FlatList, TouchableOpacity, Alert, ScrollView  } from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from 'expo-checkbox';
import CrudService from "../services/crudService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useTheme, Text as TextNativeBase } from "native-base";
import ComponentButton from "../components/Button";

type Idata = {
  user_id: string;
  itens: string[];
  post_id: string;
  created_at: Date;
  report_reading: boolean;
}


export function CheckList({ navigation }) {
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [checkBoxLeitura, setcheckBoxLeitura] = useState<boolean>(false);
  const [checkIten, setCheckIten] = useState([]);
  const [dados, setDados] = useState<Idata[]>([]);
  const [itensAnterior, setItensAnterior] = useState();
  const [itens, setItens] = useState([]);
  const [post, setPost] = useState('');
  const crudService = new CrudService();

  useEffect(() => {
    searchLatestCheckList();
    itensAPI();
  }, [])

  async function searchLatestCheckList(){
    try {
      const response = await crudService.findAll('/service-day');
      setDados(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function listarItensAntigo(){
    try {
      const r = await crudService.findLatestItensPost('/service-day/latest');
      const latest = r.data
      setItensAnterior(latest);
      console.log(itensAnterior)
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const itensAPI = async() => {
    try {
      const response = await crudService.findAllItensPost('post/itens');
      setItens(response.data);
    } catch (error) {
      //console.log(error.response.data);
      setItens(error.response.data);
    }
  }

  const startDayService = async () => {
    if(checkBoxLeitura == false){
      Alert.alert("Leitura do relatório", "Você não confirmou a leitura do relatório deseja proseguir ?", [
        {
          text: 'Aceitar',
          onPress: async () => {
            const id = await AsyncStorage.getItem("id");
            const post = await AsyncStorage.getItem("post")
            var nameItens = [];
            setLoading(true);
            checkIten.map(e => nameItens.push(e.itens));
            await crudService.save("/service-day", {
              user_id: id,
              itens: nameItens,
              post_id: post,
              created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              report_reading: checkBoxLeitura == true ? 1 : 0
            }).then(async (e) => {
              await navigation.navigate("HomeAuth")
            }).catch(e => {
              console.log(e.response.data);
              return
            }).finally(() => setLoading(false))
          }
        },
        {
          text: 'Cancelar',
          onPress: () => {return}
        }
      ])
    }
    if(checkBoxLeitura == true){
      const id = await AsyncStorage.getItem("id");
      const post = await AsyncStorage.getItem("post")
      var nameItens = [];
      setLoading(true);
      checkIten.map(e => nameItens.push(e.itens));
      await crudService.save("/service-day", {
        user_id: id,
        itens: nameItens,
        post_id: post,
        created_at: dayjs().format(),
        report_reading: checkBoxLeitura == true ? 1 : 0
      }).then(async (e) => {
        await navigation.navigate("HomeAuth")
      }).catch(e => {
        console.log(e.response.data);
        return
      }).finally(() => setLoading(false))
      await navigation.navigate("HomeAuth")
    }
  }

  const listAllItens = ({item, index}) => (
    <View style={styles.checkList}>
      <Checkbox
        value={checkIten.find(iten => iten.itensId === item.itensId ? true : false)}
        key={item.itensId}
        color={setCheckIten ? '#000' : '#CEE0EF'}
        onValueChange={() => {
          handleListTap(item)
        }}
      />
      <Text style={styles.textoCheckBox}>{item.itens}</Text>
    </View>
  )

  const listarItensAnterior = ({index, item}) => (
    <View>
      <Text style={styles.textoCheckListAnterior}>{item.itens}</Text>
    </View>
  )

  const handleListTap = (item) => {
    let itenId = [...checkIten];   // add this
    const index = itenId.indexOf(item);
    console.log(checkIten)
     if (index > -1) {
      itenId.splice(index, 1);    // add this
     } else {
      itenId.push(item); // add this
     }
    setCheckIten(itenId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSuperior}>
        <Text style={styles.textoRelatorio}>INFORMAÇÕES DO RELATÓRIO ANTERIOR</Text>
        <FlatList
          data={itensAnterior}
          renderItem={listarItensAnterior}
        />
        <Text>{dados.created_at}</Text>
        {dados.report_reading === 1 ? <Text>FOI CONFIRMADO A LEITURA DO RELATÓRIO</Text> : 
        <Text>NÃO FOI CONFIRMADO A LEITURA DO RELATÓRIO</Text>}
        <Button title="Atualizar" onPress={listarItensAntigo}/>
      </View>
       <View style={styles.checkListContainer}>
        <TextNativeBase color={colors.white} fontSize="md" m={2}>CHECK LIST DOS EQUIPAMENTOS</TextNativeBase>
          
        <FlatList 
            data={itens}
            renderItem={listAllItens}
          />
       </View>
       <TextNativeBase color={colors.white} fontSize="md" m={2}>Confirmar leitura do relatório anterior</TextNativeBase>
       <Checkbox 
        value={checkBoxLeitura}
        onValueChange={setcheckBoxLeitura}
       />
       <ComponentButton title="Proseguir" m={4} ftColor={colors.white} bgColor={colors.green[700]} isLoading={loading} onPress={startDayService}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4889BF',
    alignItems: 'center',
    flex: 1
  },
  containerSuperior: {
    paddingTop: 25,
    paddingBottom: 5,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textoRelatorio:{
    fontSize: 16,
    fontWeight: 'bold',
    margin: 12
  },
  textoCheckListAnterior: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 2
  },
  checkList: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5
  },
  textoCheckBox: {
    marginLeft: 10,
    fontSize: 18,
    color: '#CEE0EF'
  },
  checkListContainer: {
    marginTop: 25,
    height: 200
  },
  checkConfirm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
    marginBottom: 20
  },
  buttonProseguir: {
    width: 120,
    height: 35,
    backgroundColor: '#3d916a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 25
  },
  textoButtonProseguir: {
    fontSize: 16,
    color: '#fff'
  }
});


/*

          */