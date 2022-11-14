import { View } from "react-native";
import { Center, Spinner, useTheme} from "native-base";

export default function Loading(){
  const {colors} = useTheme()
  return(
    <Center flex={1} bg="gray.700">
      <Spinner color="white"/>
    </Center>
  )
}