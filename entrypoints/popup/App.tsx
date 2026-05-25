import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { dark } from '@/lib/theme';
import ExtHeader from '@/components/ExtHeader';
import IdleView from '@/components/IdleView';
import ExtractingView from '@/components/ExtractingView';
import DoneView from '@/components/DoneView';
import ErrorView from '@/components/ErrorView';
import { runPipeline } from '@/lib/pipeline';
import { getSettings } from '@/lib/storage';

type State =
  | { phase: 'idle' }
  | { phase: 'extracting'; url: string; stage: 'fetching' | 'ai'; summaryText: string }
  | { phase: 'done'; result: {
        id: string; url: string; title: string; summary: string; tags: string[]; category: string;
      } }
  | { phase: 'error'; message: string };

function isSavableUrl(u: string | undefined): u is string {
  if (!u) return false;
  return /^https?:\/\//.test(u) &&
    !u.startsWith('chrome://') &&
    !u.startsWith('chrome-extension://') &&
    !u.startsWith('about:') &&
    !u.startsWith('edge://');
}

export default function App() {
  const [state, setState] = useState<State>({ phase: 'idle' });
  const [currentTabUrl, setCurrentTabUrl] = useState<string>('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('inkwell-ext-theme') !== 'light')
  const toggleDark = () => setDarkMode(d => !d)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('inkwell-ext-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleSave = (url: string) => {
    setState({ phase: 'extracting', url, stage: 'fetching', summaryText: '' });
    runPipeline(url, (ev, data) => {
      if (ev === 'extracted') {
        setState(s => s.phase === 'extracting' ? { ...s, stage: 'ai' } : s);
      } else if (ev === 'summary_chunk') {
        const d = data as { text: string };
        setState(s => s.phase === 'extracting'
          ? { ...s, summaryText: s.summaryText + d.text }
          : s);
      } else if (ev === 'done') {
        const d = data as any;
        setState({ phase: 'done', result: {
          id: d.id, url: d.url, title: d.title,
          summary: d.summary, tags: d.tags || [], category: d.category,
        }});
      } else if (ev === 'error') {
        const d = data as { message: string; code?: string; id?: string };
        if (d.code === 'already_saved' && d.id) {
          getSettings().then(({ apiUrl }) => {
            browser.tabs.create({ url: `${apiUrl}/article/${d.id}` });
            window.close();
          });
          return;
        }
        setState({ phase: 'error', message: d.message || 'Pipeline error' });
      }
    }).catch(e => {
      setState({ phase: 'error', message: e.message || 'Network error' });
    });
  };

  // Prefill URL of current tab into the Idle paste box.
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const u = tabs[0]?.url;
      if (isSavableUrl(u)) setCurrentTabUrl(u);
    });
  }, []);

  const handleOpenArticle = async (id: string) => {
    const { apiUrl } = await getSettings();
    await browser.tabs.create({ url: `${apiUrl}/article/${id}` });
    window.close();
  };

  return (
    <div style={{
      width: 360, background: 'var(--bg)', color: 'var(--text-1)',
      borderRadius: 0, overflow: 'hidden',
    }}>
      <ExtHeader darkMode={darkMode} toggleDark={toggleDark} />
      {state.phase === 'idle' && (
        <IdleView initialUrl={currentTabUrl} onSave={handleSave} onOpenArticle={handleOpenArticle} />
      )}
      {state.phase === 'extracting' && (
        <ExtractingView url={state.url} stage={state.stage} summaryText={state.summaryText} />
      )}
      {state.phase === 'done' && (
        <DoneView result={state.result} />
      )}
      {state.phase === 'error' && (
        <ErrorView message={state.message} onRetry={() => setState({ phase: 'idle' })} />
      )}
    </div>
  );
}
