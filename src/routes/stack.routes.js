import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../Home/index';
import Login from '../Login/index';
import RondaPonto from '../RondaPonto/index';
import HomeAuth from '../HomeAuth/index';

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes(){
  return(
    <Navigator>
      <Screen name="Home" component={Home} options={{
        headerShown: false
      }}/>
      
      <Screen name="Login" component={Login} options={{
        headerShown: false
      }}/>

      <Screen name="RondaPonto" component={RondaPonto}/>

      <Screen name="HomeAuth" component={HomeAuth} options={{
        headerShown: false
      }}/>
    </Navigator>
  )
}