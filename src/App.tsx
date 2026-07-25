import Navbar from './components/Navbar'
import Silk from './components/ui/Background'
import GeminiInputBox from './components/ui/input';


export default function App() {
	return (
		<>
			<Navbar />
			<main className="container mx-auto bg-[#0e0e0e] min-h-[calc(100vh-70px)] min-w-full flex">
				<header className="relative min-h-full w-full flex flex-col items-center justify-center overflow-hidden">
					<Silk
						speed={5}
						scale={1}
						color="#343434"
						noiseIntensity={1.5}
						rotation={0}
					/>
					<div className="w-full mx-auto flex flex-col z-0 gap-10 items-center justify-center">
						<h1 className="text-center font-bold font-stretch-150% text-white text-3xl sm:text-6xl">Where knowledge <br /> begins.</h1>
						<GeminiInputBox />
					</div>
				</header>
			</main>
		</>
	)
}
