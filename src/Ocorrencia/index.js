import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import React, { useState } from 'react';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';


export default function Ocorrencia(){

  const tipos = ['Incêndio', 'Furto', 'Acidente de Trabalho', 'Acidente Carro'];
  const [pickedImagePath, setPickedImagePath] = useState('');

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
  }

  async function salvar(){
    await axios.post('https://backend-seguranca.herokuapp.com/api/users',
      {

      }
    ).then(r => {
      r.data;
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
      />
      <Text style={styles.textoTitulo}>Local</Text>
      <TextInput style={styles.inputOcorrencia}/>

      <Text style={styles.textoTitulo}>Tipo</Text>
      <SelectDropdown 
        data={tipos}
        onSelect={(selectItem, index) => {
          console.log(selectItem, index);
        }}
        buttonStyle={true}
      />

      <TouchableOpacity style={styles.botaoFoto} onPress={pegarFoto}>
        <Text>Adicionar foto</Text>
      </TouchableOpacity>

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
    backgroundColor: '#63C6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoPrincipal: {
    fontSize: 30,
    color: '#fff'
  },
  textoTitulo:{
    color: '#fff',
    fontSize: 22,
    margin: 20
  },
  inputOcorrencia: {
    backgroundColor: '#fff',
    width: 300,
    height: 'auto',
    borderRadius: 5
  },
  botao: {
    height: 40,
    width: 140,
    backgroundColor: '#3d916a',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textoBotao:{
    fontSize: 18,
    color: '#fff'
  },
  botaoFoto: {
    width: 100,
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20
  }
});