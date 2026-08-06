import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CloudsHome from './components/CloudsHome/CloudsHome';
import PageShell from './components/PageShell';
import { SiteMusicProvider } from './components/audio/SiteMusicProvider';
import PersistentDas from './components/chrome/PersistentDas';
import { SiteChromeProvider } from './components/chrome/SiteChromeProvider';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));

function ShellPage({ section, children }) {
	return (
		<PageShell section={section}>
			<Suspense fallback={null}>{children}</Suspense>
		</PageShell>
	);
}

export default function App() {
	return (
		<SiteMusicProvider>
			<SiteChromeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<CloudsHome />} />
						<Route path="/about" element={<ShellPage section="about"><AboutPage /></ShellPage>} />
						<Route path="/projects" element={<ShellPage section="projects"><ProjectsPage /></ShellPage>} />
						<Route path="/experience" element={<ShellPage section="experience"><ExperiencePage /></ShellPage>} />
						<Route path="/education" element={<ShellPage section="education"><EducationPage /></ShellPage>} />
					</Routes>
					<PersistentDas />
				</BrowserRouter>
			</SiteChromeProvider>
		</SiteMusicProvider>
	);
}
