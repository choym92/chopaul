# Implementation Roadmap — chopaul.com SEO

> 단계별 기술 구현 가이드

## Phase 1: Foundation (1~4주)

### Week 1: 구조화 데이터 수정

#### 1.1 Article 스키마 보강
**파일**: `src/app/blog/[slug]/page.tsx`
- `dateModified` 필드 추가
- `image` 필드 추가
- `author` 상세 정보 추가 (url, image)
- `publisher` 정보 추가

#### 1.2 Project 페이지 스키마 추가
**파일**: `src/app/projects/[slug]/page.tsx`
- `CreativeWork` 또는 `SoftwareApplication` 스키마 추가
- `author`, `datePublished`, `description` 포함

#### 1.3 WebSite 스키마 추가
**파일**: `src/app/layout.tsx` 또는 `src/app/page.tsx`
- `WebSite` 스키마 (siteSearchBox 포함 가능)

#### 1.4 BreadcrumbList 스키마
**파일**: 블로그/프로젝트 페이지
- `Home > Blog > [Post Title]` 구조

### Week 2: Sitemap & 메타 태그 개선

#### 2.1 Sitemap 수정
**파일**: `src/app/sitemap.ts`
- `lastModified`를 Sanity의 `_updatedAt` 필드로 변경
- GROQ 쿼리에 `_updatedAt` 추가

#### 2.2 블로그 메타 태그 강화
**파일**: `src/app/blog/[slug]/page.tsx`
- `article:modified_time` OpenGraph 태그 추가
- `article:tag` OpenGraph 태그 추가

#### 2.3 프로젝트 OG 이미지
- 프로젝트 이미지가 없을 때 동적 OG 이미지 폴백 확인

### Week 3: 내부 링크 & 네비게이션

#### 3.1 관련 포스트 컴포넌트
- 블로그 포스트 하단에 관련 포스트 3개 표시
- 같은 태그 기반 추천

#### 3.2 프로젝트-블로그 상호 링크
- 프로젝트 페이지에서 관련 블로그 포스트 링크
- 블로그에서 관련 프로젝트 링크

### Week 4: About 페이지 E-E-A-T 강화

#### 4.1 ProfilePage 스키마
**파일**: `src/app/about/page.tsx`
- `ProfilePage` 스키마 추가
- 자격/역량 정보 구조화

---

## Phase 2: Expansion (5~12주)

### 태그 시스템 구현
- `/blog/tag/[tag]` 라우트 추가
- 태그별 포스트 목록 페이지
- sitemap에 태그 페이지 포함
- `CollectionPage` 스키마

### RSS 피드
- `/feed.xml` 라우트 추가
- 블로그 포스트 자동 포함
- `<link rel="alternate">` 메타 태그

### 콘텐츠 발행 인프라
- 블로그 포스트 SEO 체크리스트 문서화
- Sanity에 SEO 필드 추가 검토 (메타 설명 커스텀)

---

## Phase 3: Scale (13~24주)

### GEO (AI 검색) 최적화

#### llms.txt 추가
**파일**: `public/llms.txt`
```
# chopaul.com
> Data Scientist Youngmin Cho의 포트폴리오 & 기술 블로그

## About
Youngmin Cho는 AI/ML/NLP 분야의 데이터 사이언티스트입니다.

## Key Pages
- /about: 소개 및 경력
- /blog: 기술 블로그
- /resume: 이력서
- /projects: 프로젝트 포트폴리오
```

#### robots.txt AI 크롤러 허용 확인
- GPTBot, ClaudeBot, PerplexityBot 등 차단 여부 확인
- 필요시 명시적 허용

#### 콘텐츠 인용 최적화
- 각 포스트에 "핵심 요약" 섹션 추가
- 명확한 정의, 수치, 사실 중심 문장 포함
- FAQ 형식 콘텐츠 추가

### 성능 최적화
- Core Web Vitals 모니터링 설정
- LCP < 2.5s, INP < 200ms, CLS < 0.1 유지
- 이미지 포맷 최적화 (WebP/AVIF)

---

## Phase 4: Authority (7~12개월)

### 고급 스키마
- `FAQPage` 스키마 (적절한 페이지에)
- `HowTo` 스키마 (튜토리얼 포스트에)
- `Dataset` 스키마 (데이터셋 관련 포스트에)

### 외부 시그널
- Google Search Console 등록 및 모니터링
- Bing Webmaster Tools 등록
- GitHub 프로필 README에 사이트 링크
- LinkedIn 프로필에 사이트 링크

### 분석 고도화
- Search Console 데이터 기반 키워드 전략 조정
- 콘텐츠 성과 분석 및 업데이트 주기 설정

---

## 우선순위 요약

| 순위 | 작업 | 예상 임팩트 | 난이도 |
|------|------|-----------|--------|
| 1 | Article 스키마 보강 | 높음 | 낮음 |
| 2 | Sitemap lastModified 수정 | 중간 | 낮음 |
| 3 | BreadcrumbList 스키마 | 중간 | 낮음 |
| 4 | Project 페이지 스키마 | 중간 | 낮음 |
| 5 | WebSite 스키마 | 중간 | 낮음 |
| 6 | 관련 포스트 컴포넌트 | 높음 | 중간 |
| 7 | 태그 페이지 | 높음 | 중간 |
| 8 | llms.txt | 중간 | 낮음 |
| 9 | RSS 피드 | 낮음 | 낮음 |
| 10 | 콘텐츠 클러스터 | 높음 | 높음 |

## 실행 시 사용할 Claude Code 스킬

| 작업 | 스킬 |
|------|------|
| 스키마 마크업 생성/검증 | `/seo-schema` |
| 기술 SEO 점검 | `/seo-technical` |
| 페이지별 SEO 분석 | `/seo-page` |
| 콘텐츠 품질 분석 | `/seo-content` |
| AI 검색 최적화 | `/seo-geo` |
| sitemap 검증 | `/seo-sitemap` |
| 이미지 최적화 | `/seo-images` |
| OG 이미지 생성 | `/seo-image-gen` |
