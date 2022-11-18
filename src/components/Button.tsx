import {Button, IButtonProps} from "native-base"

type IProps = IButtonProps & {
  title: string;
  ftColor: string;
  bgColor: string | object;
  onPress?: any;
  m: string | number;
}

export default function ComponentButton({title, ftColor, bgColor, onPress, m, ...rest}: IProps){
  return(
    <Button m={m} color={ftColor} bg={bgColor} onPress={onPress} {...rest}>
      {title}
    </Button>
  )
}