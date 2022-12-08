import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Center, HStack, Icon, Pressable, Text, useTheme, VStack } from "native-base";
import dayjs from "dayjs";
import { ROUND_COLLECTION } from "../storage/storageConfig";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface IData{
  id: string;
  locale: string;
  name: string;
  stats: string;
}

export default function RondaListaPonto() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IData[]>([]);
  const {colors} = useTheme();

  const navigation = useNavigation();

  const roundsUser = async() => {
    try {
      const rounds = await AsyncStorage.getItem(ROUND_COLLECTION);
      setData(JSON.parse(rounds));
      setLoading(false);
      //console.log(JSON.parse(rounds));
      return rounds;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function Ponto(point_id: string){
    console.log(point_id)
    const horario = await AsyncStorage.getItem("horario");
    const horarioAtual = dayjs().format('YYYY-MM-DD HH:mm:ss')
    setLoading(true);
    if(horarioAtual >= horario){
      navigation.navigate("PontoSelecionado", {point_id});
    }else{
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
      <Center>
        <Pressable 
        bg="gray.300" 
        mb="8" 
        w="2/3" 
        borderRadius="md" 
        p="4"
        _pressed={{style: {
          backgroundColor: colors.gray[200],
          borderColor: colors.gray[300]
        }}}
        onPress={() => {Ponto(item.id)}} 
        >
          <VStack>
              <HStack justifyContent="space-around">
                <Icon 
                  as={MaterialCommunityIcons}
                  name="qrcode-scan"
                  color="gray.400"
                  size={16}
                />
              <VStack>
                <Text color="gray.400" fontSize="md">{item.name}</Text>
                <Text color="gray.400" fontSize="md">{item.locale}</Text>
              </VStack>
            </HStack>
          </VStack>
        </Pressable>
      </Center>
  );

  useEffect(() => {
    roundsUser();
  },[loading, data]);

  return (
    <VStack bg="gray.500" flex={1}>
      <Header />
        <FlatList 
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{height: 250}}
          showsVerticalScrollIndicator={false}
        />
    </VStack>
  )
}


//