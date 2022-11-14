import {Button} from "native-base"

export default function ComponentButton({title, ftColor, bgColor, onPress, m}){
  return(
    <Button m={m} color={ftColor} bg={bgColor} onPress={onPress}>
      {title}
    </Button>
  )
}