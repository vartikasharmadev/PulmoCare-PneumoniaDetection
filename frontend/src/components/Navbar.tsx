import { useEffect, useState } from 'react';
import { Button } from './Button';
import { BrandMark } from './BrandMark';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToAnalysis = () => {
    const el = document.getElementById('analysis-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm shadow-clinical-900/5 border-b border-clinical-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl shadow-md shadow-clinical-600/20 overflow-hidden shrink-0">
            <BrandMark size={36} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Pulmo<span className="text-clinical-600">Care</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
              Clinical imaging
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            GitHub
          </Button>
          <Button variant="primary" size="sm" type="button" onClick={scrollToAnalysis}>
            Open scanner
          </Button>
        </div>
      </div>
    </nav>
  );
}
