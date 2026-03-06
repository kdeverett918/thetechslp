import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Portfolio from './sections/Portfolio';
import Contact from './sections/Contact';
const Playground = lazy(() => import('./sections/Playground'));
const PromptLibrary = lazy(() => import('./pages/PromptLibrary'));
const NotFound = lazy(() => import('./pages/NotFound'));

function SectionFallback() {
  return (
    <section id="playground" className="section-padding bg-[var(--color-surface)]">
      <div className="container-wide">
        <div className="card-solid p-8 sm:p-10">
          <p className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)] mb-4">
            Interactive Demos
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] tracking-tight mb-4">
            Loading Demo Studio
          </h2>
          <p className="text-[var(--color-text-muted)] font-body leading-relaxed max-w-2xl">
            The interactive studies are split into a separate chunk so the home page loads faster.
          </p>
        </div>
      </div>
    </section>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container-wide pt-28 pb-24">
        <div className="card-solid p-8 sm:p-10 max-w-3xl">
          <p className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)] mb-4">
            Loading
          </p>
          <p className="text-[var(--color-text-muted)] font-body leading-relaxed">
            Preparing the next view.
          </p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Suspense fallback={<SectionFallback />}>
        <Playground />
      </Suspense>
      <Contact />
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompts" element={<PromptLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
