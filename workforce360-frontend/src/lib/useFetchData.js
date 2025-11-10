import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, queryParams) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { params: queryParams });
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, queryParams]);

  return { data, loading, error };
};

export default useFetchData;
