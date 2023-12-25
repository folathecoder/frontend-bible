import { useState, useCallback } from 'react';
import type { ErrorType } from '@/api-integration/types';

interface PropType {
  postData: PostDataType;
}

// Define the structure of the return type for the hook
interface ReturnType {
  data: []; // Placeholder
  isSuccess: boolean;
  isError: ErrorType;
  isLoading: boolean;
  handlePostData: () => void;
}

// Define the structure of the data type
interface PostDataType {
  title: string;
  slug: string;
  image_url: string;
}

const usePost = ({ postData }: PropType): ReturnType => {
  const [data, setData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState<ErrorType>({
    status: false,
    message: '',
  });

  const handlePostData = useCallback(async () => {
    try {
      // Initialize the loading state on start
      setIsLoading(true);

      // Post Data to the backend via the endpoint
      const response = await fetch(`https://blocktools.fly.dev/blogs/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Any other headers required like token
        },
        body: JSON.stringify(postData),
      });

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
  }, [postData]);

  // Return the state values for external use
  return { data, isSuccess, isError, isLoading, handlePostData };
};

export default usePost;
