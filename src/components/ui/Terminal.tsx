import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'prompt';
  content: string;
}

type SendStep = null | 'name' | 'email' | 'message';

const COMMANDS: Record<string, string[]> = {
  help: [
    'Available commands (type any and press Enter):',
    '',
    '  $ help      — Show this message',
    '  $ about     — Who am I',
    '  $ skills    — Tech stack & experience',
    '  $ projects  — Featured work',
    '  $ contact   — Get in touch',
    '  $ send      — Send me a message directly',
    '  $ clear     — Clear terminal',
  ],
  about: [
    'Ariel Lobos — Computer Engineer & Full Stack Developer',
    '',
    '15+ years building software. I specialize in creating',
    'robust solutions that bridge technical and non-technical',
    'teams. Currently focused on React, Node.js, TypeScript,',
    'and leading engineering teams.',
  ],
  skills: [
    'Tech Stack:',
    '',
    '  React JS      4 years',
    '  Node.js       6 years',
    '  JavaScript    6 years',
    '  TypeScript    5 years',
    '  Python        4 years',
    '  Flutter       3 years',
  ],
  projects: [
    'Featured Projects:',
    '',
    '  [1] Personal Site        Next.js / TypeScript / Tailwind',
    '  [2] Bar Management API   Node.js / MongoDB / Docker',
    '  [3] Next.js Starter      TypeScript / Jest / ESLint',
    '  [4] Chile GeoJSON        Python / Pandas / PostGIS',
    '',
    'Visit /projects for details.',
  ],
  contact: [
    'Get in touch:',
    '',
    '  Email     → ariel@atariki.com',
    '  GitHub    → github.com/atariki-haoa',
    '  LinkedIn  → linkedin.com/in/atariki-haoa',
    '',
    'Or type $ send to message me directly from here.',
  ],
};

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to ariel.terminal v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [sendStep, setSendStep] = useState<SendStep>(null);
  const [sendData, setSendData] = useState({ name: '', email: '' });
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const fetchCsrf = useCallback(async (): Promise<string | null> => {
    if (csrfToken) return csrfToken;
    try {
      const res = await fetch('/api/csrf');
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.csrfToken) return null;
      setCsrfToken(data.csrfToken);
      return data.csrfToken as string;
    } catch {
      return null;
    }
  }, [csrfToken]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const handleSendFlow = useCallback(
    async (value: string) => {
      const trimmed = value.trim();

      if (sendStep === 'name') {
        if (!trimmed) {
          addLines([
            { type: 'prompt', content: `name: ${value}` },
            { type: 'output', content: 'Name cannot be empty. Try again:' },
            { type: 'output', content: '' },
          ]);
          return;
        }
        setSendData(prev => ({ ...prev, name: trimmed }));
        setSendStep('email');
        addLines([
          { type: 'prompt', content: `name: ${trimmed}` },
          { type: 'output', content: '' },
          { type: 'output', content: 'email:' },
        ]);
        return;
      }

      if (sendStep === 'email') {
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          addLines([
            { type: 'prompt', content: `email: ${value}` },
            { type: 'output', content: 'Please enter a valid email. Try again:' },
            { type: 'output', content: '' },
          ]);
          return;
        }
        setSendData(prev => ({ ...prev, email: trimmed }));
        setSendStep('message');
        addLines([
          { type: 'prompt', content: `email: ${trimmed}` },
          { type: 'output', content: '' },
          { type: 'output', content: 'message:' },
        ]);
        return;
      }

      if (sendStep === 'message') {
        if (!trimmed) {
          addLines([
            { type: 'prompt', content: `message: ${value}` },
            { type: 'output', content: 'Message cannot be empty. Try again:' },
            { type: 'output', content: '' },
          ]);
          return;
        }

        addLines([
          { type: 'prompt', content: `message: ${trimmed}` },
          { type: 'output', content: '' },
          { type: 'output', content: 'Sending...' },
        ]);

        setSendStep(null);

        try {
          const token = await fetchCsrf();
          if (!token) {
            addLines([
              { type: 'output', content: 'Error: could not verify session. Try again later.' },
              { type: 'output', content: '' },
            ]);
            setSendData({ name: '', email: '' });
            return;
          }

          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': token || '',
            },
            body: JSON.stringify({
              name: sendData.name,
              email: sendData.email,
              message: trimmed,
            }),
          });

          if (res.ok) {
            addLines([
              { type: 'output', content: 'Message sent successfully.' },
              { type: 'output', content: '' },
            ]);
          } else {
            addLines([
              { type: 'output', content: 'Error: could not send message. Try again later.' },
              { type: 'output', content: '' },
            ]);
          }
        } catch {
          addLines([
            { type: 'output', content: 'Error: connection failed. Try again later.' },
            { type: 'output', content: '' },
          ]);
        }

        setSendData({ name: '', email: '' });
      }
    },
    [sendStep, sendData, addLines, fetchCsrf]
  );

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();

      if (sendStep) {
        handleSendFlow(cmd);
        return;
      }

      const newLines: TerminalLine[] = [{ type: 'input', content: cmd }];

      if (trimmed === '') {
        setLines(prev => [...prev, ...newLines]);
        return;
      }

      if (trimmed === 'clear') {
        setLines([]);
        setSendStep(null);
        setSendData({ name: '', email: '' });
        return;
      }

      if (trimmed === 'send') {
        setSendStep('name');
        newLines.push(
          { type: 'output', content: '' },
          { type: 'output', content: 'Send a message to Ariel.' },
          { type: 'output', content: 'Type "cancel" at any step to abort.' },
          { type: 'output', content: '' },
          { type: 'output', content: 'name:' }
        );
        setLines(prev => [...prev, ...newLines]);
        return;
      }

      const response = COMMANDS[trimmed];
      if (response) {
        response.forEach(line => {
          newLines.push({ type: 'output', content: line });
        });
      } else {
        newLines.push({ type: 'output', content: `command not found: ${trimmed}` });
      }
      newLines.push({ type: 'output', content: '' });

      setLines(prev => [...prev, ...newLines]);
    },
    [sendStep, handleSendFlow]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = input;
      setInput('');

      if (sendStep && value.trim().toLowerCase() === 'cancel') {
        setSendStep(null);
        setSendData({ name: '', email: '' });
        addLines([
          { type: 'prompt', content: value },
          { type: 'output', content: 'Cancelled.' },
          { type: 'output', content: '' },
        ]);
        return;
      }

      handleCommand(value);
    },
    [input, sendStep, handleCommand, addLines]
  );

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const promptSymbol = sendStep ? '>' : '$';

  return (
    <div
      onClick={handleContainerClick}
      className="w-full bg-gray-950 rounded-lg border border-gray-700 shadow-2xl font-mono text-sm overflow-hidden cursor-text"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-500 text-xs">ariel@portfolio:~</span>
      </div>

      <div ref={outputRef} className="p-4 h-64 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === 'input' ? (
              <span>
                <span className="text-green-400">$ </span>
                <span className="text-gray-300">{line.content}</span>
              </span>
            ) : line.type === 'prompt' ? (
              <span>
                <span className="text-yellow-400">&gt; </span>
                <span className="text-gray-300">{line.content}</span>
              </span>
            ) : (
              <span className="text-gray-400">{line.content || '\u00A0'}</span>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className={sendStep ? 'text-yellow-400' : 'text-green-400'}>{promptSymbol} </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent text-gray-300 outline-none ml-1 caret-green-400"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
