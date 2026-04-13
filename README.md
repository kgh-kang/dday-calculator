# D-Day 계산기

디데이 계산, 커플 기념일, 타임라인을 한곳에서 관리할 수 있는 웹 서비스입니다.

## 페이지 구성

- **디데이 계산** (`index.html`) - 날짜 간 일수 계산, 실시간 카운트다운, 이미지 저장
- **커플 / 기념일** (`couple.html`) - 사귄 날짜 기준 기념일 타임라인, 다음 기념일 알림
- **타임라인** (`timeline.html`) - 여러 D-Day를 타임라인으로 한눈에 관리

## 주요 기능

- 실시간 카운트다운 (일/시간/분/초)
- 시작 날짜 + 목표 날짜 커스텀 설정
- 주/시간/분/초 표시 토글
- 커플 기념일 자동 계산 (100일 ~ 10주년)
- 기념일 타임라인 시각화 (오늘 마커 포함)
- 인스타 스토리용 이미지 저장 (PNG)
- 블로그/노션 임베드 위젯 코드
- localStorage 기반 데이터 저장
- 탭 이동 시 마지막 계산 자동 복원
- SEO 최적화 (meta, sitemap, robots.txt)

## 기술 스택

- HTML / CSS / JavaScript (순수 프론트엔드)
- 서버 불필요, 정적 호스팅 가능
- GitHub Pages 배포 가능

## 실행

브라우저에서 `index.html`을 열거나, GitHub Pages로 배포하면 됩니다.

## 배포

```bash
# GitHub Pages 배포
git push origin main
# repo Settings > Pages > Source: main branch
```
