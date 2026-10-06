import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface BookmarkProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  websiteUrl?: string;
  userAvatar?: string;
}

interface ToggleBookmarkVariables {
  project: BookmarkProject;
  isSaved: boolean;
}

export const useBookmarks = () => {
  return useQuery<BookmarkProject[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await axios.get<BookmarkProject[]>('/api/bookmarks');
      return response.data;
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ project, isSaved }: ToggleBookmarkVariables) => {
      if (isSaved) {
        await axios.delete<void>('/api/bookmark', { data: { title: project.title } });
      } else {
        await axios.post<void>('/api/bookmark', project);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};
