import { Input as NativeBaseInput, IInputProps,Text } from "native-base"


export function ComponentInput({...rest}: IInputProps){
  return(
    <NativeBaseInput 
    bg="muted.200"
    borderWidth={0}
    _focus={{
      borderWidth: 1,
      backgroundColor: "muted.300"
    }}
    {...rest}
    />
  )
}