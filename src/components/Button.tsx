import {Button, IButtonProps} from "native-base"

type IProps = IButtonProps & {
  title: string;
  onPress?: any;
}

export default function ComponentButton({title, onPress, ...rest}: IProps){
  return(
    <Button onPress={onPress} {...rest}>
      {title}
    </Button>
  )
}