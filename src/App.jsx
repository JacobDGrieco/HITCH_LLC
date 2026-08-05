import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CloudsHome from './components/CloudsHome/CloudsHome';
import PageShell from './components/PageShell';
import { SiteMusicProvider } from './components/audio/SiteMusicProvider';
import PersistentDas from './components/chrome/PersistentDas';
import { SiteChromeProvider } from './components/chrome/SiteChromeProvider';
import ProjectsPage from './pages/ProjectsPage';
import EducationPage from './pages/EducationPage';
import ExperiencePage from './pages/ExperiencePage';
import AboutPage from './pages/AboutPage';

export default function App() {
	return (
		<SiteMusicProvider>
			<SiteChromeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<CloudsHome />} />
						<Route path="/about" element={<PageShell section="about"><AboutPage /></PageShell>} />
						<Route path="/projects" element={<PageShell section="projects"><ProjectsPage /></PageShell>} />
						<Route path="/experience" element={<PageShell section="experience"><ExperiencePage /></PageShell>} />
						<Route path="/education" element={<PageShell section="education"><EducationPage /></PageShell>} />
					</Routes>
					<PersistentDas />
				</BrowserRouter>
			</SiteChromeProvider>
		</SiteMusicProvider>
	);
}
