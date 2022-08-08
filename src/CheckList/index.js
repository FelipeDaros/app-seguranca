import { View, StyleSheet, Text  } from "react-native";
import React, { useState } from "react";
import { CheckBox, Icon, ListItem } from '@rneui/themed';
import { FlatList } from "react-native-gesture-handler";


export default function Login({ navigation }) {
  const [checkBox, setCheckBox] = useState(false)
  const [checkBoxLeitura, setCheckLeitura] = useState(false)

  

  return (
    <View style={styles.container}>
      <Text>Check List</Text>
      <View style={styles.containerCheckList}>
        <FlatList

        />
        <CheckBox
          center
          title="Confirmo a leitura do relatório"
          type="material"
          color="grey"
          size={25}
          checked={checkBoxLeitura}
          onPress={() => setCheckLeitura(!checkBoxLeitura)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d13f3f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCheckList: {
    height: 250,
    width: 300,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 5
  }
});