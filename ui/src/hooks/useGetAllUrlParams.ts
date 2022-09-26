import { useLocation} from 'react-router-dom'

export const useGetUrlParams = () => {
  const { search } = useLocation();
  const params: {[key: string]: string | null | undefined | boolean} = {};
  const a = new URLSearchParams(search);
  for (let [key, value] of a) {
    if(value === 'undefined'){
      value = undefined
    }
    if(value === 'null'){
      value = null
    }
    if(value === 'true'){
      value = true
    }
    if(value ==='false'){
      value = false
    }
    params[key] = value;
  }
  return params;
};
