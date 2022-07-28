import { Button, Text, TouchableOpacity, View, StyleSheet} from "react-native";


export default function Home({ navigation }){
  function login(){
    navigation.navigate('Login')
  }
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button 
      title="Login"
      onPress={login}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#63C6FF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});