import { useState, useCallback } from 'react';
import type { ErrorType } from '@/api-integration/types';

interface PropType {
  resourceId: string; // Assuming the resource identifier is a string
}

// Define the structure of the return type for the hook
interface ReturnType {
  data: []; // Placeholder
  isSuccess: boolean;
  isError: ErrorType;
  isLoading: boolean;
  handleDeleteData: () => void; // Updated function name to reflect DELETE
}

const useDelete = ({ resourceId }: PropType): ReturnType => {
  const [data, setData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState<ErrorType>({
    status: false,
    message: '',
  });

  const handleDeleteData = useCallback(async () => {
    try {
      // Initialize the loading state on start
      setIsLoading(true);

      // Delete Data from the backend via the endpoint using fetch
      const response = await fetch(
        `https://blocktools.fly.dev/blogs/${resourceId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Any other headers required like token
          },
        }
      );

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
  }, [resourceId]);

  // Return the state values for external use
  return { data, isSuccess, isError, isLoading, handleDeleteData };
};

export default useDelete; // Updated hook name to useDelete
