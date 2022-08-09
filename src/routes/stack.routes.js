import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../Login/index';
import RondaPonto from '../RondaPonto/index';
import HomeAuth from '../HomeAuth/index';
import Ocorrencia from '../Ocorrencia/index';
import RondaListaPonto from '../ListaPonto/index';
import CheckList from '../CheckList/index';

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes(){
  return(
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Login" component={Login}/>
      <Screen name="CheckList" component={CheckList}/>
      <Screen name="RondaPonto" component={RondaPonto}/>
      <Screen name="HomeAuth" component={HomeAuth}/>
      <Screen name="Ocorrencia" component={Ocorrencia}/>
      <Screen name="RondaListaPonto" component={RondaListaPonto}/>
    </Navigator>
  )
}