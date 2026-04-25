# 작업 기록

## 프로젝트 목표
- 구글 검색 상위 노출 (SEO)
- 사용자 유입 → AdSense 광고 수익 확보

## 초기 분석 (2026-04-21)

### 기존 사이트 강점
- 이미지 내보내기 (인스타 스토리)
- 위젯 임베드 코드
- 타임라인 시각화
- 다크모드 + 깔끔한 UI
- 외부 의존성 0개 (빠른 로딩)

### 기존 사이트 약점
- 페이지 3개뿐 (인덱싱 볼륨 부족)
- JSON-LD 구조화 데이터 없음
- 한국 특화 기능 부족 (수능, 군대, 만나이 등)
- 분석 도구 없음
- 광고 미연동

### 경쟁사 분석
- **superkts.com**: 40+개 계산기, 연도별 수능 페이지로 인덱싱 확대
- **calculator.net**: 글로벌 1위, 월 5천만 방문
- **timeanddate.com**: 오가닉 검색 63%
- 한국 사이트는 대부분 AdSense 사용, 페이지당 3~5개 광고 유닛

---

## 작업 내역

### 1차 — 신규 페이지 4개 추가
**병렬 에이전트로 생성:**
- `suneung.html` — 수능 디데이 (연도별 카운트다운, 시간표, 명언)
- `military.html` — 전역일 계산기 (군별, 진행률, 진급일)
- `age.html` — 만나이 계산기 (만나이/연나이, 띠, 별자리)
- `event.html` — 이벤트 디데이 (크리스마스, 설날, 추석 등 12개)
- `privacy.html` — 개인정보처리방침

**디자인 시스템 추출:**
- `shared.css` — 공통 디자인 토큰 + 컴포넌트 (`.nav`, `.page-header`, `.card`, `.btn`, `.countdown` 등)
- `shared.js` — 유틸리티 함수 (`fmtDday`, `daysBetween`, `pad`, `generateShareCard`, `shareOrCopy`)

### 2차 — SEO 인프라
- 모든 페이지에 JSON-LD 구조화 데이터 (`WebApplication` + `FAQPage` 스키마)
- 메타 태그 (title, description, keywords, OG)
- Canonical URL
- SEO 콘텐츠 섹션 (FAQ 포함)
- `sitemap.xml` 8개 URL로 확장
- 모든 페이지에 7개 탭 네비게이션 통일

### 3차 — 디자인 통일성 작업
**문제**: 기존 3페이지(index, couple, timeline)와 신규 4페이지의 레이아웃이 달랐음

**수정 내역:**
1. nav/header 순서를 모든 페이지에서 `네비 → 제목 → 콘텐츠`로 통일
2. nav/header를 `.container` 내부로 이동 (640px 일관 적용)
3. 기존 3페이지에 `shared.css` 로드 추가, 중복 인라인 CSS 제거
4. `<nav>` → `<nav class="nav">`, `<header>` → `<header class="page-header">` 변경
5. couple.html `--card-hover` 변수 누락 수정
6. `.countdown` CSS 충돌 해소 (index/couple은 `.cd-row`로 변경)
7. footer 모든 페이지에서 동일 위치/내용으로 통일
8. 라벨 텍스트 통일 ("커플 / 기념일" → "커플/기념일")

### 4차 — 페이지 전환 깜빡임 해결
**문제**: nav를 JS로 렌더링(`renderNav()`)하던 신규 4페이지에서 페이지 로드 시 nav가 늦게 나타나 깜빡임 발생

**수정 내역:**
- `<div id="nav-slot"></div>` + `renderNav()` 제거
- 모든 페이지에 nav를 HTML로 직접 작성 (즉시 렌더링)
- placeholder 텍스트 "D-000" 제거 (JS가 채우도록 빈 값으로)

### 5차 — 트래픽/공유 기능 추가
1. **SNS 공유 버튼** (5개 페이지)
   - 카카오톡, X(트위터), 페이스북, 링크 복사
   - `shared.css`에 `.sns-share`, `.sns-btn` 스타일 추가
   - `shared.js`에 `snsShare()`, `showToast()` 함수 추가

2. **"나도 계산해보기" CTA 배너** (4개 페이지)
   - URL 파라미터로 들어온 사용자에게만 노출
   - `shared.js`에 `showCtaBanner()` 함수
   - 공유 링크 → 신규 사용자 전환 유도

3. **인기 디데이 랭킹** (index.html)
   - 크리스마스, 새해, 수능, 전역일, 만나이, 커플, 할로윈, 밸런타인데이
   - 실시간 D-Day 계산 + 해당 페이지로 이동

---

## 최종 파일 구성

| 파일 | 역할 |
|------|------|
| `index.html` | 메인 디데이 계산기 + 인기 디데이 |
| `couple.html` | 커플 기념일 (핑크 액센트) |
| `timeline.html` | 디데이 타임라인 |
| `suneung.html` | 수능 디데이 (연도별) |
| `military.html` | 전역일 계산기 |
| `age.html` | 만나이 계산기 |
| `event.html` | 이벤트 디데이 |
| `privacy.html` | 개인정보처리방침 |
| `shared.css` | 공통 디자인 시스템 |
| `shared.js` | 공통 유틸리티 |
| `sitemap.xml` | 8개 URL 사이트맵 |
| `robots.txt` | 검색엔진 크롤링 허용 |

---

## 향후 계획

### 단기 (이미 가능)
- [ ] 커스텀 도메인 연결 (`dday.github.io` → `dday-calc.kr` 등)
- [ ] AdSense 신청 + 광고 배치
- [ ] Google Analytics 4 설치
- [ ] Google Search Console 등록

### 중기 (트래픽 확보 후)
- [ ] PWA 지원 (manifest.json + Service Worker)
- [ ] 라이트모드 토글
- [ ] 영업일 계산 (한국 공휴일 DB)
- [ ] 시즌 페이지 자동 생성 (수능 디데이 2027, 2028...)

### 장기 (월 10만 방문 이후)
- [ ] 백엔드 도입 시 익명 댓글 기능
- [ ] 사용자 계정/디데이 클라우드 동기화
- [ ] 부동산/금융 계산기 추가 (RPM 3~5배)
