# Full SEO Audit Report — chopaul.com

> 감사일: 2026-03-27
> 비즈니스 유형: 개인 포트폴리오 & 기술 블로그 (데이터 사이언티스트)
> 페이지 수: 6 (홈, About, Blog, Resume, Projects/araverus, Blog/ml-embedding...)

---

## Executive Summary

### Overall SEO Health Score: 58/100

```
수정 전: 42/100
수정 후: 58/100  (+16점)
```

### 카테고리별 점수

| 카테고리 | 가중치 | 수정 전 | 수정 후 | 가중 점수 |
|----------|--------|--------|--------|----------|
| Technical SEO | 22% | 62 | 75 | 16.5 |
| Content Quality | 23% | 25 | 30 | 6.9 |
| On-Page SEO | 20% | 55 | 65 | 13.0 |
| Schema / Structured Data | 10% | 40 | 80 | 8.0 |
| Performance (CWV) | 10% | 85 | 85 | 8.5 |
| AI Search Readiness | 10% | 10 | 35 | 3.5 |
| Images | 5% | 30 | 40 | 2.0 |
| **합계** | **100%** | | | **58.4** |

### Top 5 Critical Issues

1. 🔴 **About 페이지 극단적 thin content** (~25단어, 최소 400 권장)
2. 🔴 **Resume 페이지 데이터 미입력** (Sanity CMS에 경력/학력 없음)
3. 🔴 **블로그 포스트 1개뿐** (콘텐츠 체계 미확립)
4. 🔴 **307 리다이렉트** (chopaul.com → www, 영구 리다이렉트로 변경 필요)
5. 🔴 **외부 브랜드 시그널 부재** (Reddit, YouTube, Wikipedia 없음)

### Top 5 Quick Wins (이미 수정 완료 ✅)

1. ✅ 블로그 설명 "software engineering" → "data science" 수정
2. ✅ 보안 헤더 4개 추가 (CSP, X-Frame-Options 등)
3. ✅ 스키마 마크업 6개 유형 추가/보강
4. ✅ llms.txt 생성 + AI 크롤러 명시적 허용
5. ✅ Sitemap 정리 (lastModified 수정, 불필요 필드 제거)

---

## 1. Technical SEO (75/100)

### ✅ 양호한 항목
- HTTPS 적용 + HSTS (max-age=63072000)
- robots.txt 정상 (studio 차단, AI 크롤러 명시적 관리)
- Sitemap 동적 생성, Sanity _updatedAt 사용
- ISR 캐싱 (3600s) + Vercel CDN
- SSR/SSG 전체 적용 (JS 렌더링 의존 없음)
- 보안 헤더 4개 추가 (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- X-Powered-By 헤더 제거

### ⚠️ 개선 필요
- 307 임시 리다이렉트 → 301/308 영구 리다이렉트 (Vercel 설정)
- NEXT_PUBLIC_SITE_URL 환경변수 www.chopaul.com 확인 필요
- IndexNow 미구현
- Google Search Console / Bing Webmaster Tools 미등록

---

## 2. Content Quality (30/100)

### 페이지별 콘텐츠 상태

| 페이지 | 단어 수 | 최소 권장 | E-E-A-T | 상태 |
|--------|--------|----------|---------|------|
| `/` | ~180 | 500 | 약함 | 🔴 |
| `/about` | ~25 | 400 | 거의 없음 | 🔴🔴 |
| `/blog` | 1 포스트 | - | - | 🟡 |
| `/resume` | ~20 | 300 | 구조만 있음 | 🔴 |
| `/projects/araverus` | ~2,100 | 800 | 강함 | ✅⭐ |
| `/blog/ml-embedding...` | 미확인 | 1,500 | - | 🆕 |

### E-E-A-T 종합: 42/100

| Factor | 점수 | 핵심 시그널 |
|--------|------|------------|
| Experience | 15/25 | Araverus 강력, 나머지 부재 |
| Expertise | 12/25 | 기술적 깊이 있으나 자격 미표시 |
| Authoritativeness | 5/25 | 외부 인용/백링크 없음 |
| Trustworthiness | 10/25 | HTTPS ✅, 연락처 ✅, 바이오 부재 |

---

## 3. On-Page SEO (65/100)

### 메타 태그 상태

| 페이지 | Title | Description | Canonical | OG | 상태 |
|--------|-------|-------------|-----------|-----|------|
| `/` | ✅ | ✅ | ✅ | ✅ | 양호 |
| `/about` | ✅ | ⚠️ 짧음 | ✅ | ✅ | 양호 |
| `/blog` | ✅ | ✅ | ✅ | ✅ | 양호 |
| `/resume` | ✅ | ✅ | ✅ | ✅ | 양호 |
| `/projects/araverus` | ✅ | ✅ | ✅ | ✅ | 양호 |
| `/blog/[slug]` | ✅ | ✅ | ✅ | ✅ article | 양호 |

### 헤딩 구조

| 페이지 | H1 | 계층 | 문제 |
|--------|-----|------|------|
| `/` | "Building tools that think." | H1→H2 | ⚠️ 키워드 없음 |
| `/about` | "Paul Cho" | H1→H2 | ⚠️ 이름 불일치 (Youngmin vs Paul) |
| `/projects/araverus` | "Araverus.com" | H1→H2→H3 | ✅ 완벽 |

### 내부 링크

- 네비게이션 링크: 양호 (Projects, Blog, About)
- 콘텐츠 내 상호 링크: 🔴 부족 (관련 포스트/프로젝트 연결 없음)

---

## 4. Schema / Structured Data (80/100)

### 구현 현황 (수정 후)

| 페이지 | 스키마 유형 | 상태 |
|--------|-----------|------|
| `/` | WebSite + Person (jobTitle 포함) | ✅ |
| `/blog/[slug]` | Article (dateModified, image, publisher) + BreadcrumbList | ✅ |
| `/projects/[slug]` | CreativeWork (keywords, author) + BreadcrumbList | ✅ |
| `/about` | ProfilePage (Person mainEntity, knowsAbout) | ✅ |
| `/blog` | 없음 | ⬜ 향후 CollectionPage |
| `/resume` | 없음 | ⬜ 향후 ProfilePage |

### 검증 결과
- 필수 필드 완성도: 95%
- JSON-LD 형식: ✅
- 서버 사이드 렌더링: ✅
- 절대 URL 사용: ✅

---

## 5. Performance / CWV (85/100)

| 지표 | 상태 | 비고 |
|------|------|------|
| SSR/ISR | ✅ | x-nextjs-prerender: 1 |
| CDN 캐싱 | ✅ | Vercel Edge, HIT 확인 |
| 폰트 최적화 | ✅ | font-display: swap, preload |
| 이미지 최적화 | ✅ | next/image, auto format |
| ETag | ✅ | 브라우저 캐싱 지원 |
| LCP 위험 요소 | ⚠️ | araverus-logo.png 566KB (WebP 변환 권장) |

---

## 6. AI Search Readiness (35/100)

| 항목 | 수정 전 | 수정 후 |
|------|--------|--------|
| llms.txt | ❌ | ✅ 생성 |
| AI 크롤러 허용 | 암시적 | ✅ 5개 명시적 허용 |
| 트레이닝 크롤러 차단 | 없음 | ✅ CCBot, Bytespider 차단 |
| 인용 가능 패시지 | 2개 | 2개 (콘텐츠 추가 필요) |
| 브랜드 시그널 | GitHub, LinkedIn만 | GitHub, LinkedIn만 |
| Reddit/YouTube | ❌ | ❌ (수동 작업 필요) |

---

## 7. Images (40/100)

| 항목 | 상태 |
|------|------|
| Alt 텍스트 | ⚠️ Portable Text 이미지 수정 완료, 대부분 양호 |
| 파일 크기 | ⚠️ araverus-logo.png 566KB |
| 포맷 | ✅ SVG(로고), JPEG(프로필), PNG→auto(Sanity CDN) |
| CLS 방지 | ✅ width/height 설정됨 |
| 미사용 파일 | ✅ 5개 삭제 완료 |
| 시각 자료 풍부함 | 🔴 스크린샷/다이어그램 부재 |
