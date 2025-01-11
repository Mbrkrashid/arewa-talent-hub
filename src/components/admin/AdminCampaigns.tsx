import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

export const AdminCampaigns = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['tiktokCampaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">TikTok Ad Campaigns</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div>Loading campaigns...</div>
      ) : (
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
                <span className={`px-2 py-1 rounded-full text-xs ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};