import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CloudsHome from './components/CloudsHome/CloudsHome'
import PageShell from './components/PageShell'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'
import EducationPage from './pages/EducationPage'
import ExperiencePage from './pages/ExperiencePage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CloudsHome />} />
        <Route path="/projects"   element={<PageShell section="projects"><ProjectsPage /></PageShell>} />
        <Route path="/skills"     element={<PageShell section="skills"><SkillsPage /></PageShell>} />
        <Route path="/education"  element={<PageShell section="education"><EducationPage /></PageShell>} />
        <Route path="/experience" element={<PageShell section="experience"><ExperiencePage /></PageShell>} />
        <Route path="/contact"    element={<PageShell section="contact"><ContactPage /></PageShell>} />
        <Route path="/about"      element={<PageShell section="about"><div /></PageShell>} />
      </Routes>
    </BrowserRouter>
  )
}
