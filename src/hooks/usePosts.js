import { useState, useEffect } from "react";

import { getPostAPI } from "../api/axios";

const usePosts = (pageNum = 1) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsError({});
    setIsError(false);
    setIsLoading(true);

    const controller = new AbortController();
    const { signal } = controller;

    getPostAPI(pageNum, { signal })
      .then((data) => {
        setResults((pre) => [...pre, ...data]);
        setHasNextPage(Boolean(data.length));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: e.message });
      });
    return () => controller.abort();
  }, [pageNum]);

  return { isLoading, isError, error, results, hasNextPage };
};

export default usePosts;
