import {useEffect} from 'react';
import Hero from './components/Hero';
import {useReducedMotion} from './hooks/useReducedMotion';
import {startScroll} from './lib/scroll';

export default function App() {
  const reduced = useReducedMotion();

  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <>
      <main>
        <Hero reduced={reduced} />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
