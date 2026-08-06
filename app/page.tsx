import ScrollyCanvas from '../components/ScrollyCanvas';
import Overlay from '../components/Overlay';
import Projects from '../components/Projects';
import '../app/globals.css';

export default function Page() {
  return (
    <main>
      <ScrollyCanvas frameCount={90} pathPrefix={'/sequence/'} />
      {/* Overlay sits visually on top via sticky parent */}
      <Overlay />

      <section className="min-h-screen py-24 px-6 bg-bg">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold text-white mb-6">Work</h2>
          <p className="text-white/70 mb-12">Projects grid below.</p>
          <Projects />
        </div>
      </section>
    </main>
  );
}
