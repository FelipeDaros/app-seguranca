import { HStack, Icon, Image, Pressable, Text } from "native-base";
import logo from "../../assets/logo.png"
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";

const SIZE = 80

export function Header(){

  //const navigate = useNavigation();

  function handleGoBack(){
    //navigate.goBack()
  }  
  return(
    <HStack 
      w="full" 
      bg="gray.600" 
      h="32" 
      alignItems="center" 
      justifyContent="space-between" 
      pb="2" pt="6" mb="10"
    >
      <Pressable
        onPress={handleGoBack}
      >
        <Icon 
          as={MaterialCommunityIcons}
          name="arrow-left-circle"
          color="gray.200"
          size={6}
          ml="4"
        />
      </Pressable>
      <Text
        color="white"
        fontWeight="bold"
        fontFamily="body"
        fontSize="md"
        flex={1}
        pl="4"
      >
        Usuário tal
      </Text>
      <Image 
          source={logo}
          style={{width: SIZE, height: SIZE}}
          alt={"LOGO"}
          mr="4"
      />
    </HStack>
  )
}