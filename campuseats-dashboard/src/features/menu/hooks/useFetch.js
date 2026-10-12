import { useEffect, useState } from "react";

export function useFetch(url, initialData = []) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
    // initialData is only the starting value, so it isn't a dependency
  }, [url]);

  return { data, isLoading, error };
}
