import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Routes } from './src/routes/index';

export default function App() {
  return (
    <Routes />
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