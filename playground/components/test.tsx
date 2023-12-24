'use client';

import React from 'react';
import useFetch from '@/api-integration/rest-api/fetch-method/useFetch';

const Test = () => {
  const { data, isSuccess, isError, isLoading } = useFetch();

  console.log(data, isSuccess, isError, isLoading);

  return <div>Test</div>;
};

export default Test;
