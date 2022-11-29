import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Routes } from './src/routes/index';
import React from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import Loading from "./src/components/Loading";
import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEME } from './src/styles/theme';
import { CheckList } from './src/CheckList';
export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});
  
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar  
        barStyle='light-content'
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#63C6FF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

//