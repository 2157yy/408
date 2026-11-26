import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { figureNotes, figuresFor } from './knowledge';
import { relatedLab } from './questionMedia';
import type { Question } from './types';

const AnimationLab = lazy(() => import('./AnimationLab').then((module) => ({ default: module.AnimationLab })));
const asset = (file: string) => `/assets/${encodeURIComponent(file)}`;
function QuestionFigure({ question, src, index }: { question: Question; src: string; index: number }) {
  return <figure className="question-figure">
    <a href={src} target="_blank" rel="noreferrer" aria-label={`打开 ${question.id} 配图 ${index + 1}`}>
      <img src={src} alt={`${question.id} 题目配图 ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} />
    </a>
    <figcaption>题目配图 {index + 1} · 点击查看大图</figcaption>
  </figure>;
}

function QuestionPrompt({ question }: { question: Question }) {
  if (!question.promptBlocks?.length) return question.promptHtml
    ? <div className="question-prompt-content" dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
    : <p className="question-prompt">{question.prompt ?? question.summary}</p>;
  let imageIndex = 0;
  return <div className="question-prompt-content">{question.promptBlocks.map((block, index) => block.type === 'image'
    ? <QuestionFigure key={`image-${index}`} question={question} src={block.content} index={imageIndex++} />
    : <div className="question-prompt-block" key={`text-${index}`} dangerouslySetInnerHTML={{ __html: block.content }} />)}</div>;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<'study' | 'lab'>('study');
  const [labTarget, setLabTarget] = useState('dijkstra');
  const [term, setTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [kind, setKind] = useState('');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [choiceSubmitted, setChoiceSubmitted] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [mastered, setMastered] = useState(() => new Set(Object.keys(localStorage).filter((key) => key.startsWith('master-') && localStorage.getItem(key) === '1').map((key) => key.slice(7))));

  useEffect(() => {
    Promise.all([
      fetch('/questions.json').then((response) => response.json() as Promise<Question[]>),
      fetch('/question-details.json').then((response) => response.json() as Promise<Question[]>).catch(() => [] as Question[]),
    ]).then(([base, details]) => {
      const detailById = new Map(details.map((question) => [question.id, question]));
      setQuestions(base.map((question) => ({ ...question, ...detailById.get(question.id) })));
    }).finally(() => setLoaded(true));
  }, []);

  const subjects = useMemo(() => [...new Set(questions.map((q) => q.subject))], [questions]);
  const years = useMemo(() => [...new Set(questions.map((q) => q.year))].sort((a, b) => b - a), [questions]);
  const kinds = useMemo(() => [...new Set(questions.map((q) => q.group))], [questions]);

  const filtered = useMemo(() => {
    const search = term.trim().toLowerCase();
    return questions.filter((q) => (!subject || q.subject === subject)
      && (!year || q.year === Number(year))
      && (!kind || q.group === kind)
      && (!search || `${q.id} ${q.summary} ${q.prompt ?? ''} ${q.choices?.map((choice) => choice.text).join(' ') ?? ''} ${q.familyTitle} ${q.subject}`.toLowerCase().includes(search)));
  }, [questions, term, subject, year, kind]);
  const current = filtered[index];
  const currentLab = current ? relatedLab(current) : null;

  useEffect(() => { setIndex(0); setShowAnswer(false); setSelectedChoice(null); setChoiceSubmitted(false); }, [term, subject, year, kind]);
  useEffect(() => { setSelectedChoice(null); setChoiceSubmitted(false); }, [current?.id]);
  useEffect(() => { if (zoom) document.body.classList.add('modal-open'); else document.body.classList.remove('modal-open'); return () => document.body.classList.remove('modal-open'); }, [zoom]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (zoom) { if (event.key === 'Escape') setZoom(null); return; }
      if (panel !== 'study' || (event.target as HTMLElement)?.tagName === 'INPUT' || (event.target as HTMLElement)?.tagName === 'SELECT') return;
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const move = useCallback((by: number) => {
    if (!filtered.length) return;
    setDirection(by);
    setShowAnswer(false);
    setIndex((n) => (n + by + filtered.length) % filtered.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filtered.length]);

  function toggleMaster(q: Question) {
    const next = new Set(mastered);
    if (next.has(q.id)) next.delete(q.id); else next.add(q.id);
    localStorage.setItem(`master-${q.id}`, next.has(q.id) ? '1' : '0');
    setMastered(next);
  }

  return <div className="app-shell">
    <header className="masthead">
      <div className="brandline"><span className="brand-mark">408</span><span>纸上复习室</span><span className="brand-rule" /><span className="edition">真题 · 教材 · 动画</span></div>
      <div className="hero-copy"><div className="eyebrow">A QUIETER WAY TO STUDY</div><h1>一题一页，慢慢想明白。</h1><p>翻开一张题卡，先独立推演，再展开解析。教材图会告诉你为什么，动画把看不见的过程一步步演出来。</p></div>
      <div className="hero-stats"><span><b>200</b> 道题</span><i>·</i><span><b>4</b> 门专业课</span><i>·</i><span><b>18</b> 个年份</span><i>·</i><span><b>{mastered.size}</b> 道已掌握</span></div>
    </header>

    <nav className="top-tabs" aria-label="复习模式">
      <button className={panel === 'study' ? 'selected' : ''} onClick={() => setPanel('study')}><span>01</span> 题目卡片</button>
      <button className={panel === 'lab' ? 'selected' : ''} onClick={() => setPanel('lab')}><span>02</span> 动画实验室</button>
      <span className="tabs-note">四本王道教材 · 图解与通俗讲解</span>
    </nav>

    {panel === 'study' ? <main className="study-view">
      <section className="filter-panel" aria-label="筛选题目">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="搜题号、算法或关键词" aria-label="搜索题目" /></label>
        <label><span className="sr-only">课程</span><select value={subject} onChange={(e) => setSubject(e.target.value)}><option value="">全部课程</option>{subjects.map((v) => <option key={v}>{v}</option>)}</select></label>
        <label><span className="sr-only">年份</span><select value={year} onChange={(e) => setYear(e.target.value)}><option value="">全部年份</option>{years.map((v) => <option key={v}>{v}</option>)}</select></label>
        <label><span className="sr-only">题型</span><select value={kind} onChange={(e) => setKind(e.target.value)}><option value="">全部题型</option>{kinds.map((v) => <option key={v}>{v}</option>)}</select></label>
        <button className="random-button" onClick={() => { if (filtered.length) { setIndex(Math.floor(Math.random() * filtered.length)); setShowAnswer(false); } }}>随手抽题 <span>↗</span></button>
      </section>

      <div className="deck-toolbar"><span>{filtered.length ? <>第 <b>{index + 1}</b> 张 <span className="slash">/</span> 共 {filtered.length} 张</> : '没有找到匹配题目'}</span><span className="key-hint">键盘 <kbd>←</kbd> <kbd>→</kbd> 翻页</span></div>
      {!loaded ? <div className="empty-state"><div>✳</div><h2>正在整理题目卡片…</h2></div> : current ? <section className="deck-stage" aria-live="polite">
        <div className="paper-shadow paper-shadow-back" aria-hidden="true" /><div className="paper-shadow paper-shadow-mid" aria-hidden="true" />
        <article key={current.id} className={`question-paper ${direction > 0 ? 'enter-next' : 'enter-prev'}`}>
          <div className="paper-topline"><span>408 · QUESTION NOTE</span><span>{String(index + 1).padStart(3, '0')} / {String(filtered.length).padStart(3, '0')}</span></div>
          <div className="question-heading"><div><div className="question-tags"><span>{current.subject}</span><span>{current.year} 年</span><span>{current.group.replace('/算法扩展', '')}</span>{current.recall && <span className="recall-tag">回忆整理</span>}</div><h2>{current.id}{current.recall ? '†' : ''} <i>·</i> {current.familyTitle}</h2><p>{current.choices?.length ? '完整题干与选项已放入卡片，可直接选择作答。' : '完整题干已放入卡片，开放题可先自行推演。'}</p></div><button className={`master-stamp ${mastered.has(current.id) ? 'done' : ''}`} onClick={() => toggleMaster(current)} aria-pressed={mastered.has(current.id)}><span>{mastered.has(current.id) ? '✓' : '○'}</span>{mastered.has(current.id) ? '已掌握' : '我能独立做'}</button></div>

          <section className="text-question-panel"><div className="text-question-label"><span>题目原文</span><a href={current.source} target="_blank" rel="noreferrer">原题来源 ↗</a></div><QuestionPrompt question={current} />{!current.promptBlocks?.length && current.questionImages?.map((src, index) => <QuestionFigure key={src} question={current} src={src} index={index} />)}{current.choices && current.choices.length > 0 && <><div className="text-question-choices" role="radiogroup" aria-label={`${current.id} 选项`}>{current.choices.map((choice) => { const isCorrect = current.correctAnswers?.includes(choice.key) ?? false; const isWrongSelected = choiceSubmitted && selectedChoice === choice.key && !isCorrect; return <button type="button" role="radio" aria-checked={selectedChoice === choice.key} className={`choice-button ${selectedChoice === choice.key ? 'selected' : ''} ${choiceSubmitted && isCorrect ? 'correct' : ''} ${isWrongSelected ? 'incorrect' : ''}`} key={choice.key} onClick={() => { if (!choiceSubmitted) setSelectedChoice(choice.key); }}><span>{choice.key}</span><span>{choice.text}</span><i>{choiceSubmitted && isCorrect ? '✓' : isWrongSelected ? '×' : ''}</i></button>; })}</div><div className="choice-submit-row"><button type="button" className="choice-submit" disabled={!selectedChoice || choiceSubmitted} onClick={() => setChoiceSubmitted(true)}>{choiceSubmitted ? '已提交' : '提交答案'}</button>{choiceSubmitted && <><p className={`choice-result ${current.correctAnswers?.length ? (current.correctAnswers.includes(selectedChoice ?? '') ? 'is-correct' : 'is-wrong') : ''}`}>{current.correctAnswers?.length ? (current.correctAnswers.includes(selectedChoice ?? '') ? '回答正确。' : `再核对一下，正确答案：${current.correctAnswers.join('、')}。`) : '已记录选择；参考原题答案：'}</p>{!current.correctAnswers?.length && current.answerText && <p className="choice-answer-text">{current.answerText}</p>}<button className="choice-reset" type="button" onClick={() => { setChoiceSubmitted(false); setSelectedChoice(null); }}>重新作答</button></>}</div></>}</section>

          {currentLab && <a className="related-lab-link" href={`#animation-lab/${currentLab.id}`} onClick={(event) => { event.preventDefault(); setLabTarget(currentLab.id); setPanel('lab'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><span className="related-lab-icon">▶</span><span>动画讲解 · {currentLab.title}</span><b>直接打开 ↗</b></a>}

          <div className="paper-actions"><button className={`answer-button ${showAnswer ? 'revealed' : ''}`} onClick={() => setShowAnswer((open) => !open)}>{showAnswer ? '收起逐步解析' : '完成推演，展开解析'}<span>{showAnswer ? '−' : '+'}</span></button><span className="source-note">原题来源：<a href={current.source} target="_blank" rel="noreferrer">BOK408 历年真题档案 ↗</a></span></div>

          {showAnswer && <div className="answer-content">
            <div className="answer-heading"><span>THINK IT THROUGH</span><h3>把每一步说清楚</h3></div>
            <div className="step-list">{current.steps.map((step, i) => <div className="answer-step" key={`${current.id}-${i}`}><span className="step-number">{String(i + 1).padStart(2, '0')}</span><div><h4>{step.title}</h4><p>{step.body}</p></div></div>)}</div>
            <div className="answer-checks"><div><span>✓</span><p><b>答案核对</b>{current.answerCheck}</p></div><div><span>!</span><p><b>易错提醒</b>{current.pitfall}</p></div></div>
            <section className="knowledge-section"><div className="section-kicker">FROM YOUR TEXTBOOKS</div><h3>用图把知识点想透</h3><p className="book-ref">教材定位：{current.bookRef}</p>
              <div className="knowledge-grid">{figuresFor(current).map((file) => { const note = figureNotes[file]; return <article className="knowledge-card" key={file}><button className="figure-button" onClick={() => setZoom(file)} aria-label={`放大查看${note.title}`}><img src={asset(file)} loading="lazy" alt={note.title} /><span>点击放大 ⤢</span></button><div className="knowledge-copy"><span>KNOW THE IDEA</span><h4>{note.title}</h4><p className="figure-caption">{note.caption}</p><p className="plain-talk"><b>白话解释</b>{note.plain}</p></div></article>; })}</div>
            </section>
          </div>}

          <div className="paper-foot"><span>慢一点，步骤就会变清楚。</span><span>{current.id} · 408 STUDY NOTES</span></div>
        </article>
        <div className="deck-nav"><button onClick={() => move(-1)} aria-label="上一题">← <span>上一题</span></button><div className="progress-dots"><span style={{ width: `${filtered.length ? ((index + 1) / filtered.length) * 100 : 0}%` }} /></div><button onClick={() => move(1)} aria-label="下一题"><span>下一题</span> →</button></div>
      </section> : <div className="empty-state"><div>✳</div><h2>这一页暂时空着。</h2><p>换个关键词，或者清除筛选条件再找找。</p><button onClick={() => { setTerm(''); setSubject(''); setYear(''); setKind(''); }}>清除筛选</button></div>}
      <footer className="page-footer"><span>原题来源 <a href="https://zhenti.beokayy.club" target="_blank" rel="noreferrer">BOK408 档案室</a></span><span>2026† 为公开回忆整理版 · 图解来自 book/ 中四本王道教材</span></footer>
    </main> : <Suspense fallback={<div className="lab-loading">正在装订动画实验室…</div>}><AnimationLab initialDemo={labTarget} /></Suspense>}

    {zoom && <div className="zoom-backdrop" role="presentation" onClick={() => setZoom(null)}><div className="zoom-dialog" role="dialog" aria-modal="true" aria-label={figureNotes[zoom].title} onClick={(e) => e.stopPropagation()}><button className="zoom-close" onClick={() => setZoom(null)} aria-label="关闭">×</button><div className="zoom-image-wrap"><img src={asset(zoom)} alt={figureNotes[zoom].title} /></div><div className="zoom-text"><span>TEXTBOOK VISUAL</span><h2>{figureNotes[zoom].title}</h2><p>{figureNotes[zoom].plain}</p></div></div></div>}
  </div>;
}

export default App;
