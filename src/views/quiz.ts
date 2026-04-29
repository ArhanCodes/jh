import type { Module } from '../types';
import type { Store } from '../store';

export function renderQuiz(module: Module, store: Store): HTMLElement {
  const root = document.createElement('div');

  const intro = document.createElement('div');
  intro.className = 'quiz-intro';
  intro.innerHTML = `
    <h3>Module ${module.number} · Quiz</h3>
    <p>${module.quiz.length} questions. Pass with at least half correct to mark this module complete. You can retake any time.</p>
  `;
  root.appendChild(intro);

  const answers: (number | null)[] = module.quiz.map(() => null);
  let revealed = 0;

  module.quiz.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.qIdx = String(idx);

    const num = document.createElement('div');
    num.className = 'question-num';
    num.textContent = `Question ${String(idx + 1).padStart(2, '0')} / ${String(module.quiz.length).padStart(2, '0')}`;
    card.appendChild(num);

    const text = document.createElement('div');
    text.className = 'question-text';
    text.textContent = q.question;
    card.appendChild(text);

    const opts = document.createElement('div');
    opts.className = 'question-options';
    q.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + oIdx)}</span>
        <span>${opt}</span>
      `;
      btn.addEventListener('click', () => {
        if (answers[idx] !== null) return;
        answers[idx] = oIdx;
        opts.querySelectorAll<HTMLButtonElement>('.option').forEach((o, i) => {
          o.disabled = true;
          if (i === q.correctIndex) o.classList.add('correct');
          else if (i === oIdx) o.classList.add('incorrect');
        });
        explain.classList.add('show');
        explain.innerHTML = oIdx === q.correctIndex
          ? `<strong>Correct.</strong> ${q.explanation}`
          : `<strong>Not quite.</strong> ${q.explanation}`;
        revealed++;
        if (revealed === module.quiz.length) showResult();
      });
      opts.appendChild(btn);
    });
    card.appendChild(opts);

    const explain = document.createElement('div');
    explain.className = 'question-explain';
    card.appendChild(explain);

    root.appendChild(card);
  });

  const result = document.createElement('div');
  result.style.display = 'none';
  root.appendChild(result);

  const showResult = () => {
    const score = answers.reduce<number>((s, a, i) => (a === module.quiz[i]!.correctIndex ? s + 1 : s), 0);
    const passed = score >= Math.ceil(module.quiz.length * 0.5);
    result.style.display = 'block';
    result.className = 'quiz-result';
    result.innerHTML = `
      <div class="quiz-result-score">${score}/${module.quiz.length}</div>
      <div class="quiz-result-text">${
        passed
          ? 'Module marked complete. Move on to the next one.'
          : 'A little more revision and you\'ve got it. Try again any time.'
      }</div>
      <button class="btn btn-ghost btn-sm" id="quiz-retake">Retake Quiz</button>
    `;
    store.setProgress(module.id, { quizScore: score, quizTotal: module.quiz.length });
    if (passed) store.setProgress(module.id, { lessonComplete: true });
    result.querySelector<HTMLButtonElement>('#quiz-retake')!.addEventListener('click', () => {
      const fresh = renderQuiz(module, store);
      root.replaceWith(fresh);
    });
  };

  return root;
}
