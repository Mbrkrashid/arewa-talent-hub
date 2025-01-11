import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FounderInfo = () => {
  const { data: founder } = useQuery({
    queryKey: ['founderInfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_info')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

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