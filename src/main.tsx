import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import store, { persistor } from './context/store.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './utils/AppRouter.tsx'
import Navbar from './components/Navbar.tsx'
import { Toaster } from 'sonner'
createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<StrictMode>
					<>
						<Navbar />
						<AppRouter />
						<Toaster position="top-right" />
					</>
				</StrictMode>
			</PersistGate>
		</Provider>
	</BrowserRouter>
)
