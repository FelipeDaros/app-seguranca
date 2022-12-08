import { Box, HStack, Icon, Text, VStack } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps &{
  iconName: string;
  title: string;
  textDown: string;
  titleCenter: string;
}

export function Card({iconName, title, titleCenter, textDown, ...rest}: Props){
  return(
      <TouchableOpacity
        {...rest}
      >
        <VStack 
        bg="gray.300"
        w="2/3"
        alignSelf="center"
        borderRadius="sm"
        h="1/6"
        p={4}
        flex={1}
        mb="8"
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            
          >
            <Box alignItems="center" justifyContent="center">
              <Icon 
                as={MaterialCommunityIcons}
                name={iconName}
                color="gray.600"
                size={16}
              />
            </Box>
            <VStack alignItems={titleCenter ? "center" : "flex-start"}> 
              <Text color="white" mb="4">
                {title}
              </Text>
              {titleCenter ? <Text color="white" fontSize="xs" textAlign="center">Proxímo alerta {"\n"} {titleCenter}</Text> : <></>}
            </VStack>
          </HStack>
          <Text
            color="gray.200"
            textTransform="uppercase"
            fontFamily="heading"
            fontWeight="bold"
            textAlign="center"
            mt="4"
            >
            {textDown}
          </Text>
        </VStack>
      </TouchableOpacity>
  )
}

//