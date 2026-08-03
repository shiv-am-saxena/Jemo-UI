import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../context/hooks";

function Profile() {
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#0e0e0e] pt-28 px-4 text-white">
                <div className="mx-auto max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
                    <p className="text-zinc-300">Loading profile...</p>
                </div>
            </main>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate to="/auth/login" replace />
        );
    }

    const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

    return (
        <main className="min-h-screen bg-[#0e0e0e] pt-28 px-4 text-white">
            <section className="mx-auto max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 p-6 sm:p-8">
                <div className="flex items-center gap-4 border-b border-zinc-700 pb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-400 bg-zinc-800 text-xl font-semibold">
                        {initial}
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">{user.name || "User"}</h1>
                        <p className="text-zinc-400">Basic account details</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4">
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>
                        <p className="mt-1 text-base">{user.name || "Not available"}</p>
                    </div>
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Email</p>
                        <p className="mt-1 text-base">{user.email || "Not available"}</p>
                    </div>
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Verification</p>
                        <p className="mt-1 text-base">{user.isVerified ? "Verified" : "Not verified"}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Profile;
