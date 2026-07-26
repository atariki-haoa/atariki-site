import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface TerminalLine {
  isInput?: boolean;
  isOutput?: boolean;
  content: string;
}

const Terminal: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            welcome: [
              'Bienvenido a ariel.terminal v2.0.0',
              'Escribe "help" para ver los comandos disponibles.',
              ' ',
            ],
            commands: {
              help: [
                'Comandos disponibles:',
                '',
                '  help      — Muestra este mensaje',
                '  about     — Quién soy',
                '  skills    — Stack tecnológico',
                '  projects  — Proyectos destacados',
                '  contact   — Cómo contactarme',
                '  clear     — Limpiar terminal',
              ],
              about: [
                'Ariel Lobos — Full Stack Developer',
                '',
                '10+ años construyendo software. Especialista en',
                'React, Node.js y TypeScript, liderando equipos',
                'y conectando negocio con tecnología.',
              ],
              skills: [
                'Tech Stack:',
                '',
                '  React JS      4 años',
                '  Node.js       6 años',
                '  TypeScript    5 años',
                '  Python        4 años',
                '  Flutter       3 años',
              ],
              projects: [
                'Proyectos Destacados:',
                '',
                '  [1] Sitio Personal        Next.js / TypeScript',
                '  [2] API Gestión Bares    Node.js / MongoDB',
                '  [3] Next.js Starter       TypeScript / Jest',
                '  [4] Chile GeoJSON         Python / PostGIS',
                '',
                'Visita /proyectos para más detalles.',
              ],
              contact: [
                'Contáctame:',
                '',
                '  Email     → ariel@atariki.com',
                '  GitHub    → github.com/atariki-haoa',
                '  LinkedIn  → linkedin.com/in/atariki-haoa',
              ],
            },
            notFound: (cmd: string) => `comando no encontrado: ${cmd}`,
            promptLabel: 'ariel@portfolio: ~',
          }
        : {
            welcome: [
              'Welcome to ariel.terminal v2.0.0',
              'Type "help" to see available commands.',
              ' ',
            ],
            commands: {
              help: [
                'Available commands:',
                '',
                '  help      — Show this message',
                '  about     — Who I am',
                '  skills    — Tech stack',
                '  projects  — Featured projects',
                '  contact   — How to reach me',
                '  clear     — Clear terminal',
              ],
              about: [
                'Ariel Lobos — Full Stack Developer',
                '',
                '10+ years building software. Specialist in',
                'React, Node.js and TypeScript, leading teams',
                'and connecting business with technology.',
              ],
              skills: [
                'Tech Stack:',
                '',
                '  React JS      4 years',
                '  Node.js       6 years',
                '  TypeScript    5 years',
                '  Python        4 years',
                '  Flutter       3 years',
              ],
              projects: [
                'Featured Projects:',
                '',
                '  [1] Personal Site          Next.js / TypeScript',
                '  [2] Bar Management API    Node.js / MongoDB',
                '  [3] Next.js Starter        TypeScript / Jest',
                '  [4] Chile GeoJSON          Python / PostGIS',
                '',
                'Visit /projects for more details.',
              ],
              contact: [
                'Contact me:',
                '',
                '  Email     → ariel@atariki.com',
                '  GitHub    → github.com/atariki-haoa',
                '  LinkedIn  → linkedin.com/in/atariki-haoa',
              ],
            },
            notFound: (cmd: string) => `command not found: ${cmd}`,
            promptLabel: 'ariel@portfolio: ~',
          },
    [isSpanish]
  );

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setLines(copy.welcome.map(content => ({ isOutput: true, content })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = input;
    const trimmed = raw.trim().toLowerCase();
    setInput('');

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    const newLines: TerminalLine[] = [{ isInput: true, content: raw }];

    if (trimmed === '') {
      setLines(prev => [...prev, ...newLines]);
      return;
    }

    const response = (copy.commands as Record<string, string[]>)[trimmed];
    if (response) {
      response.forEach(line => newLines.push({ isOutput: true, content: line || ' ' }));
    } else {
      newLines.push({ isOutput: true, content: copy.notFound(trimmed) });
    }
    newLines.push({ isOutput: true, content: ' ' });

    setLines(prev => [...prev, ...newLines]);
  };

  return (
    <div className="bg-term-terminal border border-term-border rounded-2xl shadow-[0_30px_60px_-20px_#00000090] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-term-panel border-b border-term-border">
        <span className="w-[11px] h-[11px] rounded-full bg-term-red" />
        <span className="w-[11px] h-[11px] rounded-full bg-term-amber" />
        <span className="w-[11px] h-[11px] rounded-full bg-term-green" />
        <span className="ml-2 text-xs text-term-dim">{copy.promptLabel}</span>
      </div>
      <div
        ref={containerRef}
        onClick={focusInput}
        className="p-[18px] h-[280px] overflow-y-auto text-[13.5px] leading-[1.8] cursor-text"
      >
        {lines.map((line, i) => (
          <div key={i}>
            {line.isInput && (
              <span>
                <span className="text-term-green">$ </span>
                <span className="text-term-sub">{line.content}</span>
              </span>
            )}
            {line.isOutput && <span className="text-term-muted">{line.content}</span>}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-term-green">$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent border-none outline-none text-term-sub font-mono text-[13.5px]"
          />
          <span className="w-[7px] h-[15px] bg-term-green animate-blink" />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
