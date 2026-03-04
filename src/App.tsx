import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Portfolio from './sections/Portfolio';
import Playground from './sections/Playground';
import Contact from './sections/Contact';
import PromptLibrary from './pages/PromptLibrary';


function Home() {
  return (
    <Layout>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Playground />
      <Contact />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prompts" element={<PromptLibrary />} />
    </Routes>
  );
}
