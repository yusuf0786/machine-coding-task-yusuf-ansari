import useSWR from 'swr';

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UseCurrentUserReturn {
  user: CurrentUser | null;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

const fetcher = async (url: string): Promise<{ user: CurrentUser }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

export function useCurrentUser(): UseCurrentUserReturn {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  return {
    user: data?.user ?? null,
    isLoading,
    isError: !!error,
    mutate,
  };
}
