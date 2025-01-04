import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type SponsoredAd = Database['public']['Tables']['sponsored_ads']['Row'];

export const SponsoredAds = () => {
  const [ads, setAds] = useState<SponsoredAd[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('sponsored_ads')
        .select('*')
        .eq('status', 'active');

      if (!error && data) {
        setAds(data);
      }
    };

    fetchAds();
  }, []);

  if (ads.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
        <h2 className="text-xl font-semibold text-white">Sponsored</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <Card
            key={ad.id}
            className="bg-black/50 border-primary/20 overflow-hidden group hover:border-primary/40 transition-colors"
          >
            <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-video">
                <img
                  src={ad.image_url || ''}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-white mb-2">{ad.title}</h3>
                <p className="text-gray-400 text-sm">{ad.description}</p>
              </div>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};