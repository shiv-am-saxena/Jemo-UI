import { Navigate, useNavigate } from 'react-router-dom';
import Silk from './components/ui/Background'
import GeminiInputBox from './components/ui/Input';
import { useAppSelector } from './context/hooks';
import { models } from './utils/inputUtils';

export default function App() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	if (isAuthenticated) {
		return <Navigate to="/chat" replace />;
	}
	function handleSubmit() {
		navigate('/auth/login', { replace: true });
	}
	return (
		<main className="container mx-auto bg-[#0e0e0e] min-h-screen min-w-full flex">
			<header className="relative min-h-full w-full flex flex-col items-center justify-center overflow-hidden">
				<Silk
					speed={5}
					scale={1}
					color="#343434"
					noiseIntensity={1.5}
					rotation={0}
				/>
				<div className="w-full mx-auto flex flex-col z-0 gap-10 items-center justify-center">
					<h1 className="text-center font-bold font-stretch-150% text-white text-4xl sm:text-6xl lg:text-7xl">Where knowledge <br /> begins.</h1>
					<GeminiInputBox models={models} onSubmit={handleSubmit} />
				</div>
			</header>
		</main>
	)
}
