import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">L</span>
            </div>
            <span className="text-white text-xl font-semibold">levitation</span>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">
                Sign up to begin journey
              </CardTitle>
              <p className="text-gray-400 text-sm">
                This is basic signup page which is used for levitation assignment purpose.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Enter your name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Enter Email ID"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-gray-400 text-xs">
                    This name will be displayed with your inquiry
                  </p>
                  {errors.name && (
                    <p className="text-red-400 text-xs">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter Email ID"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-gray-400 text-xs">
                    This email will be displayed with your inquiry
                  </p>
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Password
                  </label>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Enter the Password"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-gray-400 text-xs">
                    Any further updates will be forwarded on this Email ID
                  </p>
                  {errors.password && (
                    <p className="text-red-400 text-xs">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold px-8"
                  >
                    {registerMutation.isPending ? 'Registering...' : 'Register'}
                  </Button>
                  <Link
                    to="/login"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Already have account ?
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-yellow-400/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              {/* Simulated image placeholder with gradient background */}
              <div className="w-96 h-64 bg-gradient-to-br from-green-400 to-yellow-400 rounded-lg shadow-2xl transform rotate-3">
                <div className="absolute inset-4 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-2xl">L</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Connecting People
                    </h3>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      with Technology
                    </h3>
                    <p className="text-sm text-gray-600">
                      SOFTWARE DEVELOPMENT | ERP | CRM SERVICES
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
