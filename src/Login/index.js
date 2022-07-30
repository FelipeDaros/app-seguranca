import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button, Alert } from "react-native";
import React, {useState} from "react";
import axios from 'axios';


export default function Login({ navigation }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login(){
    console.log(email, password)

    
    await axios.post('https://backend-seguranca.herokuapp.com/api/users/signin', {
      email,
      password
    }).then(r => {;
      navigation.navigate('HomeAuth')
    }).catch(r => {
      Alert.alert('Usuário ou senha Inválida')
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textoApp}>Segurança na Mão</Text>
      <View>
        <Text style={styles.textoInput}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={
          (e) => {setEmail(e)}
        } keyboardType='email-address'/>
      </View>
      <View>
        <Text style={styles.textoInput}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={
          (a) => {setPassword(a)}
        } secureTextEntry={true}/>
      </View>
      <TouchableOpacity style={styles.botaoLogin} onPress={login}>
        <Text style={styles.textBotaoLogin}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#63C6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoApp: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 45
  },
  textoInput: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  },
  input: {
    width: 200,
    height: 30,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 5,
    textAlign: 'center'
  },
  botaoLogin: {
    justifyContent: 'center',
    backgroundColor: '#000',
    height: 30,
    width: 100,
    borderRadius: 5,
    marginTop: 20
  },
  textBotaoLogin: {
    textAlign: 'center',
    color: '#fff'
  }
});