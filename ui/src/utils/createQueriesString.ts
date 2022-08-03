
export const createQueriesString = (args: string[][]): string => {
  let queriesString = ""
  for(let i = 0; i < args.length; i++){
    queriesString = queriesString + `${args[i][0]}=${args[i][1]}${i === args.length-1 ? "" : '&'}`
  }
  return queriesString;
}