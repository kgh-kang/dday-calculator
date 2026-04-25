# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트를 이해하기 위한 가이드입니다.

## 프로젝트 개요

**D-Day Calculator** — 한국 사용자 대상 디데이/날짜 계산기 웹사이트.
- 100% 정적 사이트 (HTML/CSS/JS만, 빌드 단계 없음)
- 외부 의존성 0개
- GitHub Pages 배포 (`https://dday.github.io/`)
- 데이터는 `localStorage`만 사용 (백엔드 없음)

## 목표
- 구글 검색 상위 노출 (SEO)
- AdSense 광고 수익 (한국 시장 타깃)

## 파일 구조

```
dday-calculator/
├── index.html        — 메인 디데이 계산기 + 인기 디데이 랭킹
├── couple.html       — 커플 기념일 (핑크 액센트)
├── timeline.html     — 디데이 타임라인
├── suneung.html      — 수능 디데이 (?year=2026 파라미터)
├── military.html     — 전역일 계산기
├── age.html          — 만나이 계산기
├── event.html        — 이벤트 디데이 (?type=christmas 파라미터)
├── privacy.html      — 개인정보처리방침
├── shared.css        — 공통 디자인 시스템 (모든 페이지가 로드)
├── shared.js         — 공통 유틸리티 함수
├── sitemap.xml       — 8개 URL
├── robots.txt
├── WORKLOG.md        — 작업 기록
└── 디자인참고/        — Claude.ai에서 만든 초기 디자인 (건드리지 말 것)
```

## 디자인 시스템

### 색상 (CSS 변수, `shared.css`)
```css
--bg: #0a0a0a;          /* 배경 */
--card: #141414;        /* 카드 배경 */
--card-hover: #1a1a1a;  /* 카드 hover */
--border: #222;         /* 테두리 */
--text: #e8e8e8;        /* 본문 */
--text-sub: #777;       /* 서브 텍스트 */
--accent: #6C63FF;      /* 액센트 (보라) */
--accent2: #FF6584;     /* 보조 액센트 (핑크) */
```
**예외**: `couple.html`은 `--accent`/`--accent2`를 swap (핑크 메인)

### 공통 컴포넌트 (`shared.css`)
- `.nav` — 상단 pill 탭 (가로 스크롤)
- `.page-header` — 페이지 제목 영역
- `.card` — 카드 컴포넌트
- `.big-number` — 그라디언트 큰 숫자
- `.countdown` — 4칸 카운트다운 그리드
- `.btn`, `.btn.secondary` — 버튼
- `.chip`, `.chip.active` — 칩 선택자
- `.progress`, `.progress-fill` — 진행률 바
- `.sns-share`, `.sns-btn` — SNS 공유 버튼
- `.cta-banner` — 공유 링크 사용자용 CTA

### 공통 유틸리티 (`shared.js`)
```js
fmtDday(days)              // 'D-100', 'D-DAY', 'D+30' 포맷
daysBetween(from, to)      // 두 날짜 간 일수
pad(n)                     // '01', '09' 형태로 패딩
generateShareCard(opts)    // Canvas로 1080x1080 공유 이미지 생성
downloadShareCard(url, fn) // 이미지 다운로드
shareOrCopy(title,text,url)// Web Share API 또는 클립보드 복사
snsShare(platform, opts)   // 카카오/X/페이스북/복사
showToast(msg)             // 하단 토스트 알림
showCtaBanner(...)         // URL 파라미터 있을 때 CTA 노출
```

## 코드 규칙

### HTML 구조 (모든 페이지 공통)
```html
<body>
  <div class="container">
    <nav class="nav">...</nav>          <!-- 7개 탭 하드코딩 -->
    <header class="page-header">...</header>
    <!-- 페이지 콘텐츠 -->
    <article class="seo-content">...</article>
  </div>
  <footer>D-Day 계산기 &copy; 2025</footer>
</body>
```

### 절대 금지
- **`renderNav()` 사용 금지** — nav는 HTML에 직접 작성. JS 렌더링 시 페이지 로드 깜빡임 발생.
- **placeholder 텍스트 금지** — `<div id="dday">D-000</div>` 같은 임시 텍스트는 JS가 늦게 실행되면 그대로 보임. 빈 값으로 두고 JS가 채우게 할 것.
- **`.countdown` 클래스 자체 정의 금지** — `shared.css`의 grid 정의와 충돌. 다른 이름 사용 (`.cd-row` 등).
- **외부 라이브러리 추가 금지** — 의존성 0개 유지가 원칙.

### SEO 필수 요소 (모든 새 페이지)
1. 메타 태그: title, description, keywords, OG, canonical
2. JSON-LD: `WebApplication` 스키마 + `FAQPage` 스키마
3. SEO 콘텐츠 섹션 (`<article class="seo-content">`)
4. `sitemap.xml`에 추가

## 페이지별 핵심 기능

| 페이지 | URL 파라미터 | localStorage 키 |
|--------|-------------|----------------|
| index | `?name=&from=&to=` | `lastCalc`, `ddays` |
| couple | (커플 날짜) | `lastCoupleDate` |
| timeline | — | `ddays` |
| suneung | `?year=2026` | — |
| military | — | `military` |
| age | — | `age-birth` |
| event | `?type=christmas` | `event-type` |

## 작업 시 주의사항

1. **페이지 추가 시**: SEO 메타태그 + JSON-LD + sitemap.xml 업데이트 필수
2. **CSS 수정 시**: `shared.css` 우선, 페이지 고유 스타일만 인라인
3. **레이아웃 변경 시**: 7개 페이지 전부 일관성 유지 (특히 nav/header)
4. **새 기능 추가 시**: `shared.js`에 공통 함수 추가 → 각 페이지에서 호출
5. **백엔드 필요 기능 (댓글 등)**: 트래픽 충분히 확보된 후 고려

## 광고 수익화 (예정)
- AdSense 신청 후 광고 슬롯 배치 위치:
  - 결과 카드 위 (배너)
  - 결과와 부가 콘텐츠 사이
  - 페이지 하단
- 페이지당 광고 3개가 UX/수익 균형점

## 참고
- 작업 진행 기록: `WORKLOG.md`
- 초기 디자인: `디자인참고/` (수정 금지)
