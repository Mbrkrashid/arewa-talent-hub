import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const JudgeApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    expertise: "",
    yearsExperience: "",
    portfolioUrl: "",
    motivation: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to apply",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("judge_applications")
        .insert({
          profile_id: user.id,
          full_name: formData.fullName,
          expertise: formData.expertise,
          years_experience: parseInt(formData.yearsExperience),
          portfolio_url: formData.portfolioUrl || null,
          motivation: formData.motivation,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      // Reset form
      setFormData({
        fullName: "",
        expertise: "",
        yearsExperience: "",
        portfolioUrl: "",
        motivation: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/20 border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white/90">Become a Judge</h2>
          <p className="text-white/60">
            Join our panel of expert judges and help discover the next generation of talent.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="bg-black/30 border-white/10"
            />
          </div>

          <div>
            <Input
              placeholder="Area of Expertise"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              required
              className="bg-black/30 border-white/10"
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Years of Experience"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              required
              min="1"
              className="bg-black/30 border-white/10"
            />
          </div>

          <div>
            <Input
              placeholder="Portfolio URL (Optional)"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              type="url"
              className="bg-black/30 border-white/10"
            />
          </div>

          <div>
            <Textarea
              placeholder="Why do you want to be a judge? (Motivation)"
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              required
              className="bg-black/30 border-white/10"
              rows={4}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Card>
  );
};