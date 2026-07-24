import Navbar from './components/Navbar'
import Silk from './components/ui/Background'

export default function App() {
	return (
		<>
			<Navbar />
			<main className="bg-[#0e0e0e] min-h-[calc(100vh-80px)] min-w-full flex">
				<header className="relative min-h-full w-full flex items-center justify-center rounded-b-4xl overflow-hidden">
					<Silk
						speed={5}
						scale={1}
						color="#343434"
						noiseIntensity={1.5}
						rotation={0}
					/>
					<h1 className="text-white text-xl font-bold z-0">My App</h1>
				</header>
			</main>
		</>
	)
}
