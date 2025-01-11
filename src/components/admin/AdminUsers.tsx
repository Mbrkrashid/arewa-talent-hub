import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Management</h3>
      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">{user.username || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              <div className="text-sm text-gray-500">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};