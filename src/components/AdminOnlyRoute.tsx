import { ReactNode } from 'react';
import { toast } from 'sonner';

interface AdminOnlyRouteProps {
  children: ReactNode;
  isAdmin: boolean;
  fallback?: ReactNode;
}

const AdminOnlyRoute = ({ children, isAdmin, fallback }: AdminOnlyRouteProps) => {
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground">
            Please log in as admin to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnlyRoute;