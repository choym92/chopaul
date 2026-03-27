# SEO Action Plan — chopaul.com

> 우선순위별 실행 계획

---

## 이번 세션에서 완료된 수정 (✅)

| # | 수정 내용 | 파일 |
|---|----------|------|
| 1 | 블로그 설명 "software engineering" → "data science" | `blog/page.tsx` |
| 2 | 보안 헤더 4개 추가 + X-Powered-By 제거 | `next.config.ts` |
| 3 | Sitemap lastModified → Sanity _updatedAt 사용 | `sitemap.ts`, `queries.ts` |
| 4 | changeFrequency, priority 제거 (Google 무시) | `sitemap.ts` |
| 5 | 기본 도메인 www.chopaul.com으로 통일 | `sitemap.ts`, `robots.ts`, `layout.tsx` |
| 6 | 홈: WebSite + Person(jobTitle) 스키마 추가 | `page.tsx` |
| 7 | 블로그: Article 보강 + BreadcrumbList 추가 | `blog/[slug]/page.tsx` |
| 8 | 프로젝트: CreativeWork + BreadcrumbList 추가 | `projects/[slug]/page.tsx` |
| 9 | About: ProfilePage 스키마 추가 | `about/page.tsx` |
| 10 | GROQ 쿼리에 _updatedAt 추가 | `queries.ts` |
| 11 | 홈페이지 H3 → H2 헤딩 계층 수정 | `featured-project.tsx` |
| 12 | Portable Text 이미지 alt 텍스트 Sanity 연동 | `portable-text.tsx` |
| 13 | 미사용 기본 이미지 5개 삭제 | `public/` |
| 14 | llms.txt 생성 | `public/llms.txt` |
| 15 | AI 크롤러 5개 명시적 허용 + 2개 차단 | `robots.ts` |

---

## 🔴 Critical — 즉시 실행

### C1. Sanity CMS 콘텐츠 채우기
**영향**: Content Quality 30→60 예상
- About 페이지: 바이오 (300~500단어), 프로필 사진, 스킬 목록, Now 상세
- Resume 페이지: 경력, 학력, 스킬 데이터
- 홈페이지: bio snippet 텍스트

### C2. 307 → 301 영구 리다이렉트
**영향**: Technical SEO 링크 가치 전달
- Vercel Dashboard → Settings → Domains
- Primary domain을 www.chopaul.com으로 설정

### C3. NEXT_PUBLIC_SITE_URL 확인
**영향**: 모든 canonical, OG, 스키마 URL 일관성
- Vercel → Settings → Environment Variables
- 값: `https://www.chopaul.com`

### C4. Google Search Console 등록
**영향**: 인덱싱 모니터링 + 검색 성과 데이터
- https://search.google.com/search-console
- 도메인 인증 (DNS TXT 레코드 또는 HTML 파일)
- sitemap.xml 제출

### C5. Bing Webmaster Tools 등록
**영향**: Bing + Bing Copilot 가시성
- https://www.bing.com/webmasters
- Google Search Console에서 가져오기 가능

---

## 🟠 High — 1주 이내

### H1. araverus-logo.png WebP 변환
**영향**: ~500KB 절감, LCP 개선
```bash
# 예시 (cwebp 설치 후)
cwebp -q 85 public/araverus-logo.png -o public/araverus-logo.webp
```

### H2. 블로그 포스트 2~3개 추가 작성
**영향**: Content Quality + 인덱싱 페이지 수
- 권장 주제: Araverus 구축 과정, LLM 파이프라인 설계, 임베딩 모델 비교
- 작성 기준: 메모리에 저장된 블로그 가이드라인 참고

### H3. About 페이지 이름 통일
**영향**: E-E-A-T 일관성
- H1 "Paul Cho" → "Youngmin Cho" 또는 전체적으로 일관된 이름 사용

---

## 🟡 Medium — 1개월 이내

### M1. 태그 페이지 구현 (/blog/tag/[tag])
**영향**: 인덱싱 페이지 수 + 내부 링크 강화
- CollectionPage 스키마 추가
- Sitemap에 포함

### M2. RSS 피드 추가 (/feed.xml)
**영향**: 콘텐츠 배포 + 구독
- `<link rel="alternate" type="application/rss+xml">` 메타 태그

### M3. 관련 포스트/프로젝트 상호 링크 컴포넌트
**영향**: 내부 링크 밀도, 체류 시간
- 블로그 포스트 하단에 관련 포스트 3개
- 프로젝트 ↔ 블로그 상호 링크

### M4. Araverus 프로젝트에 시각 자료 추가
**영향**: Content Quality + AI 인용 가능성 (156% 향상)
- 아키텍처 다이어그램
- UI 스크린샷
- 파이프라인 플로우 차트

### M5. IndexNow 구현
**영향**: Bing/Yandex/Naver 빠른 인덱싱
- 배포 시 자동 ping

---

## 🟢 Low — 백로그

### L1. Reddit 활동 시작
- r/datascience, r/MachineLearning에 프로젝트 공유
- Perplexity + ChatGPT 인용 소스 확보

### L2. YouTube 프로젝트 데모 영상
- 브랜드 인용 최강 시그널 (상관관계 0.737)

### L3. 한국어 콘텐츠 시작 (hreflang)
- 한국어 데이터 사이언스 시장 경쟁 낮음

### L4. 뉴스레터 구독 기능
- 이메일 수집 + 재방문 유도

### L5. Blog/Resume 페이지 스키마 추가
- CollectionPage (블로그 목록)
- ProfilePage (이력서)

---

## 예상 점수 변화

| 시점 | 점수 | 주요 변화 |
|------|------|----------|
| 수정 전 | 42/100 | 기본 설정만 |
| **현재 (코드 수정 후)** | **58/100** | 스키마, 보안, sitemap, GEO |
| C1~C5 완료 후 | ~70/100 | Sanity 콘텐츠 + GSC 등록 |
| H1~H3 완료 후 | ~78/100 | 이미지 최적화 + 블로그 확장 |
| M1~M5 완료 후 | ~85/100 | 태그, RSS, 내부 링크, 시각 자료 |
| L1~L5 완료 후 | ~90/100 | 외부 시그널 + 다국어 |
