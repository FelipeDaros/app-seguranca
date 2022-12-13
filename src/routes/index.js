import { NavigationContainer} from '@react-navigation/native';
import { Box } from 'native-base';
import { StackRoutes } from './stack.routes';


export function Routes(){
  return(
    <Box flex={1} bg="gray.500">
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </Box>
  )
}