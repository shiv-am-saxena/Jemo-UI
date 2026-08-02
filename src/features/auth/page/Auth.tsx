import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../context/hooks";
import { useEffect } from "react";
import Ferrofluid from "../components/ui/Ferrofluid";

function Auth() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const location = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            location("/chat", { replace: true });
        }
    }, [isAuthenticated, location]);

    return (
        <main className="container mx-auto bg-[#0e0e0e] min-h-screen min-w-full flex">
            <header className="hidden md:flex relative min-h-full w-[60%] flex-col items-center justify-center overflow-hidden">
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
                <div className="w-full mx-auto flex flex-col z-0 gap-10 items-center justify-center">
                    <h2 className="text-white text-3xl text-center font-bold">Welcome</h2>
                    <h1 className="text-center font-bold font-stretch-175% text-white text-3xl md:text-7xl lg:text-8xl xl:text-9xl leading-20">Jemo AI.</h1>
                </div>
            </header>
            <div className="max-h-[calc(100vh-60px)] mt-15 flex w-full md:w-[40%] flex-col items-center justify-center py-4 px-8 gap-2">
                <Outlet />
            </div>
        </main>
    )
}

export default Auth