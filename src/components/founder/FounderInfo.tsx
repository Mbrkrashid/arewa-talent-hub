import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const FounderInfo = () => {
  const { data: founder, isLoading, error } = useQuery({
    queryKey: ['founderInfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_info')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Unable to load founder information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!founder) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex items-center gap-4">
        {founder.founder_image_url && (
          <img
            src={founder.founder_image_url}
            alt={founder.founder_name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{founder.founder_name}</h3>
          <p className="text-sm text-gray-600">{founder.founder_title}</p>
        </div>
      </div>
      {founder.founder_bio && (
        <p className="mt-4 text-sm text-gray-600">{founder.founder_bio}</p>
      )}
    </Card>
  );
};