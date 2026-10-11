export function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const colors = ['#8b5cf6', '#ec4899', '#f97316', '#34d399', '#3b82f6'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '100vh';
    p.style.width = '8px';
    p.style.height = '8px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '9999';
    p.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease-out';
    document.body.appendChild(p);

    setTimeout(() => {
      p.style.transform = `translate(${(Math.random() - 0.5) * 250}px, -${60 + Math.random() * 35}vh) scale(${Math.random() + 0.5})`;
      p.style.opacity = '0';
    }, 10);

    setTimeout(() => p.remove(), 1300);
  }
}