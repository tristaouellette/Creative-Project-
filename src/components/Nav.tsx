import {brand, nav} from '../content';
import {vars} from '../lib/style';
import {LogoMark} from './Marks';

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="flex h-16 items-center px-[max(1rem,2.4vw)] md:h-[4.75rem]">
        <a href="#top" className="line-in flex items-center gap-2.5" style={vars({'--d': 250})}>
          <LogoMark className="size-7 text-bone md:size-8" />
          <span className="font-display text-[1.02rem] font-semibold tracking-[0.06em] md:text-[1.1rem]">
            {brand}
          </span>
        </a>

        <ul className="mx-auto hidden items-center gap-[clamp(1.5rem,3.6vw,3.75rem)] lg:flex">
          {nav.links.map((l, i) => (
            <li key={l.href} className="line-in" style={vars({'--d': 330 + i * 60})}>
              <a
                href={l.href}
                className="group relative font-mono text-micro uppercase text-bone/85 transition-colors hover:text-bone"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-bloom transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div
          className="line-in ml-auto flex h-full items-center gap-6 border-hair lg:ml-0 lg:border-l lg:pl-8"
          style={vars({'--d': 600})}
        >
          <a
            href={nav.cta.href}
            className="hidden font-mono text-micro uppercase text-bone/85 transition-colors hover:text-pear sm:block"
          >
            {nav.cta.label}
          </a>
          <button
            type="button"
            aria-label="Open menu"
            className="group grid size-9 place-content-center gap-[5px] rounded-full"
          >
            <span className="block h-px w-5 bg-bone transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            <span className="block h-px w-5 bg-bone transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
            <span className="block h-px w-5 bg-bone" />
          </button>
        </div>
      </nav>
      <div
        className="line-in mx-[max(1rem,2.4vw)] h-px bg-hair"
        style={vars({'--d': 700})}
      />
    </header>
  );
}
