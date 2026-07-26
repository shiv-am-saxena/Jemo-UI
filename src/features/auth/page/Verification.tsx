import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Ferrofluid from '../components/ui/Ferrofluid';
import { Link, useSearchParams } from 'react-router-dom';

function Verification() {
    const [verified, setVerified] = useState(false);
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const verificationMessage = async () => {
            const success = searchParams.get("success");
            if (success === "true") {
                setVerified(true);
                toast.success("Email verified successfully! You can now log in.");
                return;
            }
            toast.error("Email verification failed. Please try again or contact support.");
        };
        verificationMessage();
    }, [searchParams]);

    return (
        <div className=" relative flex flex-col items-center justify-center min-h-screen">
            <Ferrofluid
                className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
                colors={["#ffffff", "#ffffff", "#ffffff"]}
                speed={0.5}
                scale={1.6}
                turbulence={1}
                fluidity={0.1}
                rimWidth={0.2}
                sharpness={2.5}
                shimmer={1.5}
                glow={2}
                flowDirection="down"
                opacity={1}
                mouseInteraction
                mouseStrength={1}
                mouseRadius={0.35}
            />
            <div className="relative z-0 flex flex-col items-center justify-center p-6 bg-[#1e1e1e] border border-zinc-600 rounded-lg shadow-lg">
                <h1 className="text-white text-3xl font-bold mb-4">Email Verification</h1>
                {verified ? (
                    <p className="text-white text-lg">Your email has been successfully verified!</p>
                ) : (
                    <p className="text-white text-lg">Verifying your email...</p>
                )}
                <Link to="/auth/login" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Go to Login
                </Link>
            </div>
        </div>
    );
}

export default Verification