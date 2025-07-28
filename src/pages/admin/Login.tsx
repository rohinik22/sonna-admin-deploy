import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lock,
  User,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('admin@sonnas.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (await isAuthenticated()) {
        const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });
      
      // Redirect to the page they tried to visit or dashboard
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">Sonna Sweet Bites</h1>
              <p className="text-sm text-orange-600 font-medium">Admin Portal</p>
            </div>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@sonnas.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Login to Admin Dashboard'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Email: admin@sonnas.com<br />
                  Password: admin123
                </p>
                <p className="text-xs text-blue-500 mt-2">
                  Note: Make sure to set up your Supabase project and update the environment variables before testing.
                </p>
              </div>
            </CardContent>
          </Card>

         
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
