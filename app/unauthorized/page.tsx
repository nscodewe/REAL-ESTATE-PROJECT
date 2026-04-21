'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200 bg-white rounded-xl shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            You do not have permission to access this page. Your current role does not allow access to this resource.
          </p>
          <p className="text-sm text-gray-600">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
