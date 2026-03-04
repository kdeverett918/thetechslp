import Layout from './components/Layout';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Portfolio from './sections/Portfolio';
import Playground from './sections/Playground';
import Contact from './sections/Contact';


export default function App() {
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
