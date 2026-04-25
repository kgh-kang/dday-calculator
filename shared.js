// 공통 네비게이션 렌더링
(function(){
  const NAV = [
    { href: 'index.html', label: '디데이 계산', key: 'dday' },
    { href: 'couple.html', label: '커플/기념일', key: 'couple' },
    { href: 'timeline.html', label: '타임라인', key: 'timeline' },
    { href: 'suneung.html', label: '수능 디데이', key: 'suneung' },
    { href: 'military.html', label: '전역일', key: 'military' },
    { href: 'age.html', label: '만나이', key: 'age' },
    { href: 'event.html', label: '이벤트', key: 'event' },
  ];
  window.renderNav = function(activeKey){
    const nav = document.createElement('nav');
    nav.className = 'nav';
    NAV.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.key === activeKey) a.classList.add('active');
      nav.appendChild(a);
    });
    const slot = document.getElementById('nav-slot');
    if (slot) slot.replaceWith(nav);
    else document.body.insertBefore(nav, document.body.firstChild);
  };

  // 공유: Web Share API 또는 클립보드 복사
  window.shareOrCopy = async function(title, text, url){
    url = url || location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return 'shared'; }
      catch(e) { if (e.name === 'AbortError') return 'cancelled'; }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return 'copied';
    } catch(e) { return 'failed'; }
  };

  // 공유 카드 이미지 생성 (Canvas 기반)
  window.generateShareCard = function(opts){
    const { title, bigText, subText, footer } = opts;
    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 배경
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // 배경 장식 원
    const grad1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
    grad1.addColorStop(0, 'rgba(108,99,255,0.25)');
    grad1.addColorStop(1, 'rgba(108,99,255,0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, H);

    const grad2 = ctx.createRadialGradient(880, 880, 0, 880, 880, 420);
    grad2.addColorStop(0, 'rgba(255,101,132,0.25)');
    grad2.addColorStop(1, 'rgba(255,101,132,0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    // 카드 배경
    ctx.fillStyle = '#141414';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    roundRect(ctx, 80, 180, W-160, H-360, 32, true, true);

    // 타이틀
    ctx.fillStyle = '#777';
    ctx.font = '700 28px -apple-system, Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, W/2, 280);

    // 큰 숫자 (그라디언트)
    const textGrad = ctx.createLinearGradient(0, 400, W, 600);
    textGrad.addColorStop(0, '#6C63FF');
    textGrad.addColorStop(1, '#FF6584');
    ctx.fillStyle = textGrad;
    ctx.font = '900 220px -apple-system, Pretendard, sans-serif';
    ctx.fillText(bigText, W/2, 590);

    // 서브 텍스트
    ctx.fillStyle = '#e8e8e8';
    ctx.font = '600 40px -apple-system, Pretendard, sans-serif';
    ctx.fillText(subText, W/2, 700);

    // 하단
    ctx.fillStyle = '#777';
    ctx.font = '500 24px -apple-system, Pretendard, sans-serif';
    ctx.fillText(footer || 'D-Day Calculator', W/2, H - 120);

    return canvas.toDataURL('image/png');
  };

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  window.downloadShareCard = function(dataUrl, filename){
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'share.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 간단한 D-Day 포맷
  window.fmtDday = function(days){
    if (days === 0) return 'D-DAY';
    if (days > 0) return 'D-' + days;
    return 'D+' + Math.abs(days);
  };

  window.daysBetween = function(from, to){
    const ms = 24*60*60*1000;
    const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / ms);
  };

  window.pad = n => String(n).padStart(2, '0');

  // SNS 공유
  window.snsShare = function(platform, opts) {
    const { title, text, url } = opts;
    const encodedUrl = encodeURIComponent(url || location.href);
    const encodedText = encodeURIComponent(text || title || document.title);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      band: `https://band.us/plugin/share?body=${encodedText}%20${encodedUrl}`,
    };

    if (platform === 'kakao') {
      // 카카오는 SDK 없이 카카오톡 공유 URL scheme 사용
      // 모바일에서만 동작, 데스크톱은 클립보드 복사로 fallback
      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url || location.href });
      } else {
        navigator.clipboard.writeText(`${text} ${url || location.href}`).then(() => {
          showToast('링크가 복사되었습니다');
        });
      }
      return;
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url || location.href}`).then(() => {
        showToast('링크가 복사되었습니다');
      });
      return;
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  window.showToast = function(msg) {
    let toast = document.getElementById('sns-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sns-toast';
      toast.style.cssText = 'position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--accent);color:#fff;padding:12px 24px;border-radius:10px;font-weight:600;font-size:.9rem;transition:transform .3s;z-index:999;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; }, 2000);
  };

  // CTA 배너: 공유 링크로 들어온 사용자에게 표시
  window.showCtaBanner = function(containerSelector, resetUrl, message) {
    // URL에 파라미터가 있을 때만 표시
    if (!location.search) return;
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const banner = document.createElement('div');
    banner.className = 'cta-banner';
    banner.innerHTML = `
      <p>${message || '나도 직접 계산해볼까요?'}</p>
      <a class="cta-btn" href="${resetUrl || location.pathname}">나도 계산해보기</a>
    `;
    container.appendChild(banner);
  };
})();
