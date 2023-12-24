import { useState, useEffect, useCallback } from 'react';
import type { ErrorType } from '@/api-integration/types';

// Define the structure of the return type for the hook
interface ReturnType {
  data: DataType[];
  isSuccess: boolean;
  isError: ErrorType;
  isLoading: boolean;
}

// Define the structure of the data type
interface DataType {
  tool_id: string;
  tool_name: string;
  tool_category_id: string;
  tool_version_no: string;
  tool_description: string;
  tool_url: string;
  tool_image_url: string;
  tool_watchlist_count: number;
  date_created: string;
  date_updated: string;
  tool_category: {
    tool_category_id: string;
    tool_category_name: string;
    tool_category_description: string;
    date_created: string;
    date_updated: string;
  };
}

const useFetch = (): ReturnType => {
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState<ErrorType>({
    status: false,
    message: '',
  });

  // Callback function to fetch data optimally using useCallback
  const handleFetchData = useCallback(async () => {
    try {
      // Initialize the loading state on start
      setIsLoading(true);

      // Fetch data response from the API
      const response = await fetch(`https://blocktools.fly.dev/tools`);

      // Check if the response was successful
      if (response.ok) {
        // Get the data from the response if successful
        const dataResponse = await response.json();
        setData(dataResponse);

        // Set success state
        setIsSuccess(true);
      } else {
        // If the response status is not OK, include status text in the error message
        const statusText = response.statusText || 'Unknown Error';
        setIsError({
          status: true,
          message: `Request failed with status ${response.status}: ${statusText}`,
        });

        // Set success state to false
        setIsSuccess(false);
      }
    } catch (error: any) {
      // Set the error state on error detection
      setIsError({
        status: true,
        message: error.message,
      });
    } finally {
      // Terminate the loading state on end
      setIsLoading(false);
    }
  }, []);

  // useEffect to trigger data fetching when the component mounts or when handleFetchData changes
  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  // Return the state values for external use
  return { data, isSuccess, isError, isLoading };
};

export default useFetch;
