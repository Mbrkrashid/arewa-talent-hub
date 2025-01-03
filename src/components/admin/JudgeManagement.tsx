import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, CheckCircle, XCircle } from "lucide-react";

export const JudgeManagement = () => {
  const [applications, setApplications] = useState<any[]>([]);
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
      const { error } = await supabase
        .from("judge_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

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

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id} className="p-6 bg-black/20 border-primary/20">
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
          </Card>
        ))}
      </div>
    </div>
  );
};