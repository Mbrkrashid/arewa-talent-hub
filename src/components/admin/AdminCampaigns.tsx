import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const AdminCampaigns = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_campaigns')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Campaign Management</h3>
      <div className="grid gap-4">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{campaign.campaign_name}</h4>
                <p className="text-sm text-gray-500">
                  Budget: ₦{campaign.budget?.toLocaleString()}
                </p>
              </div>
              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                {campaign.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};