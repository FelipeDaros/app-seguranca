import {Button} from "native-base"

interface IProps{
  title: string;
  ftColor: string;
  bgColor: string | object;
  onPress?: any;
  m: string | number;
}

export default function ComponentButton({title, ftColor, bgColor, onPress, m}: IProps){
  return(
    <Button m={m} color={ftColor} bg={bgColor} onPress={onPress}>
      {title}
    </Button>
  )
}