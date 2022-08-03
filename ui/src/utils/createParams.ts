export const createParams = (params: {[key: string]: string | boolean | null | undefined}) => {
  const keyVals = [];
  for(let key in params){
    keyVals.push(key+"="+ params[key])
  }
  return "?"+keyVals.join("&")
}