import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useBookmarks = () => {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await axios.get('/api/bookmarks');
      return response.data;
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ project, isSaved }) => {
      if (isSaved) {
        await axios.delete('/api/bookmark', { data: { title: project.title } });
      } else {
        await axios.post('/api/bookmark', project);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};
