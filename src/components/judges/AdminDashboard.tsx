import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, User, Clock } from "lucide-react";

type JudgeApplication = {
  id: string;
  full_name: string;
  expertise: string;
  years_experience: number;
  portfolio_url: string | null;
  motivation: string;
  status: string;
  created_at: string;
};

export const AdminDashboard = () => {
  const [applications, setApplications] = useState<JudgeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("judge_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load judge applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from("judge_applications")
        .update({ status })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      if (status === 'approved') {
        // Get the application details
        const { data: application } = await supabase
          .from("judge_applications")
          .select("profile_id, expertise, full_name")
          .eq("id", applicationId)
          .single();

        if (application) {
          // Create judge record
          const { error: judgeError } = await supabase
            .from("judges")
            .insert({
              profile_id: application.profile_id,
              expertise: application.expertise,
              bio: `${application.full_name} - ${application.expertise}`,
              status: 'active'
            });

          if (judgeError) throw judgeError;
        }
      }

      toast({
        title: "Success",
        description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });

      // Reload applications
      loadApplications();
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white/90">Judge Applications</h2>
        <Button variant="outline" onClick={() => loadApplications()}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading applications...</div>
      ) : applications.length === 0 ? (
        <Card className="p-6 text-center text-white/60">
          No pending applications
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="p-6 bg-black/20 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">
                      {application.full_name}
                    </h3>
                    <p className="text-sm text-white/60">{application.expertise}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {application.status === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleApplicationStatus(application.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleApplicationStatus(application.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded text-sm ${
                        application.status === 'approved' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Experience:</span>
                    <span className="ml-2 text-white/90">{application.years_experience} years</span>
                  </div>
                  {application.portfolio_url && (
                    <div>
                      <span className="text-white/60">Portfolio:</span>
                      <a
                        href={application.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <span className="text-white/60">Motivation:</span>
                  <p className="mt-1 text-white/90">{application.motivation}</p>
                </div>

                <div className="text-xs text-white/40">
                  Applied on: {new Date(application.created_at).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};