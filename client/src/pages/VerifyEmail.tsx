import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function VerifyEmail() {
  const [location, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing. Please check your email link.");
        return;
      }

      try {
        await verifyEmailMutation.mutateAsync({ token });
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Failed to verify email. The link may have expired.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDFBF7] to-[#F0F4F8] px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-[#C49F64] animate-spin" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Verifying Email</h1>
              <p className="text-[#6E7A85]">Please wait while we verify your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Email Verified!</h1>
              <p className="text-[#6E7A85]">{message}</p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Verification Failed</h1>
              <p className="text-[#6E7A85]">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/register")}
                  className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
                >
                  Register Again
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full border-[#C49F64] text-[#C49F64]"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
