import { Box, HStack, Icon, Text, VStack } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  image: string;
  title: string;
}

export function Card(){
  return(
    <VStack 
      bg="gray.300"
      w="2/3"
      alignSelf="center"
      borderRadius="sm"
      h="1/6"
      p={4}
    >
      <HStack
        justifyContent="space-between"
        alignItems="center"
        
      >
        <Box alignItems="center" justifyContent="center">
          <Icon 
            as={MaterialCommunityIcons}
            name="clock-check-outline"
            color="gray.200"
            size={16}
          />
        </Box>
        <VStack>
          <Text>
            ALERTA VIGIA
          </Text>
        </VStack>
        
      </HStack>
      <Text
        color="gray.200"
        textTransform="uppercase"
        fontFamily="heading"
        fontWeight="bold"
        textAlign="center"
        >
        texo abaixo
      </Text>
    </VStack>
  )
}