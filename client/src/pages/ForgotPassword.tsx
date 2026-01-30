import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError("");
    },
    onError: (error) => {
      setError(error.message || "Failed to send reset link");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    forgotPasswordMutation.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <p className="text-sm text-foreground">
              <strong>Next steps:</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Check your email inbox</li>
              <li>• Click the reset link (valid for 24 hours)</li>
              <li>• Create a new password</li>
              <li>• Log in with your new password</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> If you don't see the email, check your spam folder or try again with a different email address.
            </p>
          </div>

          <Button
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={forgotPasswordMutation.isPending}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending || !email}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
