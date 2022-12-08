import {Button, IButtonProps} from "native-base"

type IProps = IButtonProps & {
  title: string;
}

export default function ComponentButton({title, ...rest}: IProps){
  return(
    <Button {...rest}>
      {title}
    </Button>
  )
}