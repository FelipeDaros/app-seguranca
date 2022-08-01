import dayjs from "dayjs";


export function manipulateDate(data){
  var day = dayjs(data).day();
  var mounth = dayjs(data).month();
  var year = dayjs(data).year();
  var hour = dayjs(data).hour();
  var minutes = dayjs(data).minute();
  var seconds = dayjs(data).second();
  const dataConvertida = `${day}/${mounth}/${year} ${hour}:${minutes}:${seconds}`
  return dataConvertida;
}