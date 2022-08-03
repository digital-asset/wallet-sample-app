export const getAssetSum = (assetContracts: any) => {
  let sum = 0;
  
  for (let contract of assetContracts) {
    //TODO: fix type
    sum += parseFloat(contract?.payload?.amount)
  }
  return sum;
}