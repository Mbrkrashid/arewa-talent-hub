import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminVideos = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_content')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Video Management</h3>
      <div className="grid gap-4">
        {videos?.map((video) => (
          <Card key={video.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">{video.title}</p>
                <p className="text-sm text-gray-500">Views: {video.views_count}</p>
              </div>
              <div className="text-sm text-gray-500">
                Posted: {new Date(video.created_at).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};