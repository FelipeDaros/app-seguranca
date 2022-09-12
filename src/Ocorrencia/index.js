import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Pressable } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrudService from "../services/crudService";
import DatePicker from "react-native-modern-datepicker";
import dayjs from "dayjs";



export default function Ocorrencia(){
  const [resume, setResume] = useState('');
  const [place, setPlace] = useState('');
  const [type, setType] = useState('');
  const [photo, setPhoto] = ('');
  const [selectedDate, setSelectedDate] = useState('');
  const [show, setShow] = useState(false);
  const tipos = ['Incêndio', 'Furto', 'Acidente de Trabalho', 'Acidente Carro'];
  const [pickedImagePath, setPickedImagePath] = useState('');
  
  function mostrarData(){
    if(show == false){
      setShow(true);
    }else{
      setShow(false);
    }
  }

  const options = {
    backgroundColor: '#090C08',
    textHeaderColor: '#fff',
    textDefaultColor: '#fff',
    selectedTextColor: '#63C6FF',
    mainColor: '#fff',
    textSecondaryColor: '#fff',
    borderColor: 'rgba(122, 146, 165, 0.1)'
  }


  async function pegarFoto(){
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Você negou o acesso as fotos do seu celular");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }

    setPhoto = result.uri

    return result.uri;  
  }

  const crudService = new CrudService();

  async function salvar(){
    const id = await AsyncStorage.getItem("id");
    await crudService.save('/ocorrence', {
      resume: resume,
      user_id: id,
      place: place,
      type: type,
      stats: 1,
      date_occurrence: selectedDate.replace('/', '-'),
      current_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
	    photo: "SEM FOTO"
    }).then(() => {
      setPickedImagePath('');
      setPlace('');
      setResume('');
      setSelectedDate('')
      setType('');
    })
    
  }

  return(
    <View style={styles.container}>
      <Text style={styles.textoPrincipal}>Cadastro da ocorrência</Text>
      <Text style={styles.textoTitulo}>Informe a ocorrência</Text>
      <TextInput 
        multiline={true}
        style={styles.inputOcorrencia}
        placeholder="Descreva a ocorrência"
        value={resume}
        onChangeText={
          (r) => {setResume(r)}
        }
      />
      <Text style={styles.textoTitulo}>Local</Text>
      <TextInput 
        style={styles.inputOcorrencia}
        value={place}
        onChangeText={
          (p) => {setPlace(p)}
        }
      />

      <Text style={styles.textoTitulo}>Tipo</Text>
      <SelectDropdown 
        data={tipos}
        onSelect={(selectItem, index) => {
          console.log(selectItem, index);
          setType(selectItem)
        }}
        defaultButtonText={type == '' ? 'Selecione a opcção' : type}      
      />

      <TouchableOpacity style={styles.botaoFoto} onPress={pegarFoto}
      data={photo}
      >
        <Text>Adicionar foto</Text>
      </TouchableOpacity>
      {show == true ? <Pressable style={styles.botaoAtivado} onPress={mostrarData}>
        <Text style={styles.textoBotao}>Fechar data</Text>
      </Pressable>
      :
      <Pressable style={styles.botao} onPress={mostrarData}>
        <Text style={styles.textoBotao}>Mostrar Data</Text>
      </Pressable>
      }
      {show == true ? 
      <><DatePicker
      onSelectedChange={date => setSelectedDate(date)}
      options={options}
      minuteInterval={5}
      style={{ borderRadius: 10}}
      /></> : 
      <></>}
      <TextInput value={selectedDate} style={{color: '#fff', fontSize: 18}}/>
      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
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
  textoPrincipal: {
    fontSize: 30,
    color: '#CEE0EF'
  },
  textoTitulo:{
    color: '#CEE0EF',
    fontSize: 22,
    margin: 20
  },
  inputOcorrencia: {
    backgroundColor: '#CEE0EF',
    width: 300,
    height: 'auto',
    borderRadius: 5
  },
  botao: {
    height: 40,
    width: 140,
    backgroundColor: '#59b58a',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  botaoAtivado: {
    height: 40,
    width: 140,
    backgroundColor: '#ba1313',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textoBotao:{
    fontSize: 18,
    color: '#CEE0EF'
  },
  botaoFoto: {
    width: 100,
    height: 40,
    backgroundColor: '#CEE0EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20
  }
});