import React, { useState } from 'react';
import CrudService from "../services/crudService";
import dayjs from "dayjs";
import { Center, CheckIcon, FormControl, Select, Text, Toast, VStack } from "native-base";
import { Header } from '../components/Header';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import ComponentButton from '../components/Button';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Ocorrencia(){
  const [data, setData] = useState<Date>();
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");
  const [resume, setResume] = useState(""); 
  const crudService = new CrudService();
  
  async function salvar(){
    const id = await AsyncStorage.getItem("id");

    if(!data || !place){
      Toast.show({
        description: "Prencha todos os campos!",
        bg: "danger.600"
      })
    }

    try {
      await crudService.save('/ocorrence', {
        resume: resume,
        user_id: id,
        place: place,
        type: type,
        stats: 1,
        date_occurrence: data,
        current_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        photo: "SEMFOTO"
      })
    } catch (error) {
      console.log(error.response.data)
    }  
    
    
    
  }
  
  async function openData(){
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange(event, date) {
        setData(date);
      },
    });
    
    
  } 

  return(
    <VStack flex={1} bg="gray.500">
      <Header />
      <Center>
        <Text
          fontFamily="heading"
          fontSize="18"
          color="white"
          mb="1/6"
        >Registro de ocorrência</Text>
        <Text
          color="white"
          fontFamily="body"
        >
        Lugar ocorrido  
        </Text>
        <TextInput 
          style={{
            backgroundColor: "#fff",
            width: "50%",
            marginTop: 12,
            marginBottom: 12,
            borderRadius: 5
          }}
          onChangeText={(text) => {setPlace(text)}}
        />
        <Text
          color="white"
          fontFamily="body"
        >
        Descreva o ocorrido
        </Text>
        <TextInput
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: "#fff",
            width: "50%",
            marginTop: 12,
            marginBottom: 12,
            borderRadius: 5
          }}
          onChangeText={(resume) => {setResume(resume)}}
        />

        <ComponentButton 
          title='SELECIONAR DATA' 
          onPress={openData}
          bg="warning.600"
          w="1/2"
        />
        <Text color="white" fontFamily="heading" mt="6">
          TIPO
        </Text>
        <FormControl w="2/4" maxW="300">
          <Select
          fontSize="md" 
          onValueChange={(type) => setType(type)}
          my="6"
          bg="white"
          borderWidth={0}
          _selectedItem={{
            bg: "white"
          }}>
            <Select.Item label='Roubo' value="roubo"/>
            <Select.Item label='Acidente' value="acidente"/>
            <Select.Item label='Incêndio' value="incendio"/>
          </Select>
        </FormControl>

        <ComponentButton 
          title='ENVIAR' 
          onPress={salvar}
          bg="green.600"
          w="1/4"
        />
      </Center>
    </VStack>
  )
}
 

/*180*/