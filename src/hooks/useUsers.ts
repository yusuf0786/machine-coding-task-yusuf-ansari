import useSWR from 'swr';

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

const fetcher = async (url: string): Promise<{ users: User[] }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export function useUsers(): UseUsersReturn {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  return {
    users: data?.users ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
