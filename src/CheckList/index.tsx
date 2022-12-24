import { View, StyleSheet, Text, FlatList, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, Text as TextNativeBase, HStack, VStack, Box, Center, useToast } from "native-base";
import ComponentButton from "../components/Button";
import { Header } from "../components/Header";
import api from "../api/api";
import { useNavigation } from "@react-navigation/native";


export function CheckList({ navigation }) {
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [checkBoxLeitura, setcheckBoxLeitura] = useState<boolean>(false);
  const [checkIten, setCheckIten] = useState([]);
  const [itensAnterior, setItensAnterior] = useState(false);
  const [listItens, setListItens] = useState([]);
  const navigate = useNavigation();

  async function listAllItensPost(){
    const post_id = await AsyncStorage.getItem("post_id");
    api.get(`/post/find-itens-post/${post_id}`).then(response => {
      const {PostItens} = response.data;
      PostItens.map(({itens}) => {
        listItens.push(itens);
      });
    })
  }

  const listAllItens = ({item, index}) => (
    <HStack alignItems="center" mt="4">
      <Checkbox
        value={checkIten.find(iten => iten === item.id ? true : false)}
        key={item.id}
        color={setCheckIten ? '#000' : '#CEE0EF'}
        onValueChange={() => {
          handleListTap(item.id)
        }}
      />
      <TextNativeBase style={styles.textoCheckBox}>{item.name}</TextNativeBase>
    </HStack>
  )
  

  const handleListTap = (item) => {
    console.log(item)
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


  async function startDayService() {
    if(checkBoxLeitura){
      const user_id = await AsyncStorage.getItem("user_id");
      const post_id = await AsyncStorage.getItem("post_id");
      api.post("/service-day", {
        user_id,
        report_reading: true,
        itens_id: checkIten,
        post_id
      }).then(() => {
        navigate.navigate("HomeAuth");
      }).finally(() => setLoading(false));

    }
  }

  useEffect(() => {
    listAllItensPost();
  }, [])

  return (
    <VStack style={styles.container} bg="gray.400">
      <Header />
      <TextNativeBase color={colors.white} fontSize="md" m={2}>Relatório anterior</TextNativeBase>
        <VStack
          bg="gray.300"
          minH="32"
          maxH="32"
          maxW="1/2"
          minW="1/2"
          rounded="md"
        >

        </VStack>
       <View style={styles.checkListContainer}>
        <TextNativeBase color={colors.white} fontSize="md" m={2}>Check List dos equipamentos</TextNativeBase>
          
        <Center
          bg="gray.300"
          minH="32"
          maxH="32"
          maxW="1/2"
          minW="1/2"
          rounded="md"
          alignSelf="center"
        >
         <FlatList 
            data={listItens}
            renderItem={listAllItens}
            contentContainerStyle={{paddingBottom: 15}}
          />
        </Center>
       </View>
       <TextNativeBase color={colors.white} fontSize="md" m={2}>Confirmar leitura do relatório anterior</TextNativeBase>
       <Checkbox 
        value={checkBoxLeitura}
        onValueChange={setcheckBoxLeitura}
       />
       <ComponentButton 
        title="Confirmar" 
        m={4} 
        bg="gray.600" 
        isLoading={loading} 
        onPress={startDayService}
       />
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
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