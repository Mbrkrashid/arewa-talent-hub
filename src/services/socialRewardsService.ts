import { supabase } from "@/integrations/supabase/client";

export const socialRewardsService = {
  async trackSocialEngagement(platform: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check daily limit
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyRewards } = await supabase
        .from('daily_social_rewards')
        .select('rewards_count')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .gte('last_rewarded_at', today)
        .maybeSingle();

      const { data: rewardConfig } = await supabase
        .from('social_media_rewards')
        .select('reward_amount, daily_limit')
        .eq('platform', platform)
        .single();

      if (!rewardConfig) return;

      if (dailyRewards && dailyRewards.rewards_count >= rewardConfig.daily_limit) {
        console.log('Daily limit reached for', platform);
        return;
      }

      // Update or insert daily tracking
      const { error: trackingError } = await supabase
        .from('daily_social_rewards')
        .upsert({
          user_id: user.id,
          platform,
          rewards_count: (dailyRewards?.rewards_count || 0) + 1,
          last_rewarded_at: new Date().toISOString()
        });

      if (trackingError) throw trackingError;

      // Award tokens using rpc instead of sql
      const { error: tokenError } = await supabase.rpc('increment_token_balance', {
        user_id: user.id,
        amount: rewardConfig.reward_amount
      });

      if (tokenError) throw tokenError;

      console.log(`Awarded ${rewardConfig.reward_amount} tokens for ${platform} engagement`);
      return rewardConfig.reward_amount;
    } catch (error) {
      console.error('Error tracking social engagement:', error);
    }
  }
};