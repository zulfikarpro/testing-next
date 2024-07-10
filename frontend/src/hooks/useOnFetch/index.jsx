import { useState } from "react";

export default function useOnFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination,setPagination] = useState();

  const onFetch = async (fetchingFn) => {
    setIsLoading(true);

    const data = await fetchingFn()
    if (data.success === true) {
      console.log('result',result)
      setIsSuccess(true);
      setResult(data.result);
      setPagination(data.pagination)
    }
    setIsLoading(false);
  };

  return { onFetch, result, isSuccess, isLoading, pagination };
}
