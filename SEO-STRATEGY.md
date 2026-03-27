# SEO Strategy — chopaul.com

> Youngmin Cho의 데이터 사이언티스트 포트폴리오 & 블로그 사이트

## 1. 현재 상태 요약

| 카테고리 | 점수 | 상태 |
|----------|------|------|
| 페이지 구조 | 8/10 | 깔끔한 라우팅, 시맨틱 HTML |
| 메타 태그 | 7/10 | 기본 설정 완료, OG 이미지 개선 필요 |
| 구조화 데이터 | 5/10 | Person/Article만 존재, Breadcrumb/Organization 없음 |
| 기술 SEO | 8/10 | ISR 캐싱, 이미지 최적화, sitemap/robots 설정 완료 |
| 콘텐츠 구성 | 7/10 | 깔끔하지만 태그/카테고리 페이지 없음 |
| 모바일/반응형 | 9/10 | 모바일 퍼스트 설계 |
| 내부 링크 | 6/10 | 기본 링크만 존재, 전략적 연결 부족 |
| GEO (AI 검색) | 3/10 | llms.txt 없음, AI 크롤러 최적화 없음 |
| **종합** | **6.6/10** | 기반은 탄탄, 중급~고급 최적화 필요 |

## 2. 목표

### 주요 목표
1. **개인 브랜딩**: "Youngmin Cho = Data Scientist" 검색 인지도 확보
2. **전문성 입증**: AI/ML/NLP 관련 콘텐츠로 E-E-A-T 시그널 강화
3. **AI 검색 최적화**: Google AI Overviews, ChatGPT, Perplexity에서 인용 가능성 높이기
4. **포트폴리오 노출**: 프로젝트 케이스 스터디 검색 유입 확보

### KPI 목표

| 지표 | 현재 (추정) | 3개월 | 6개월 | 12개월 |
|------|------------|-------|-------|--------|
| 월 오가닉 트래픽 | ~50 | 200 | 500 | 1,500 |
| 인덱싱 페이지 수 | ~10 | 20 | 35 | 60+ |
| 키워드 랭킹 (top 20) | ~5 | 20 | 50 | 100+ |
| Core Web Vitals | Pass | Pass | Pass | Pass |
| AI 검색 인용 | 0 | 2 | 5 | 15+ |

## 3. 타겟 키워드 전략

### Tier 1: 브랜드 키워드
- `Youngmin Cho`
- `chopaul`
- `Youngmin Cho data scientist`
- `조영민 데이터 사이언티스트`

### Tier 2: 전문 분야 롱테일
- `data scientist portfolio`
- `AI project case study`
- `machine learning portfolio examples`
- `NLP project walkthrough`
- `data science blog`

### Tier 3: 콘텐츠 키워드 (블로그)
- `[기술명] tutorial` (예: `pandas groupby tutorial`)
- `[개념] explained` (예: `transformer architecture explained`)
- `how to [작업]` (예: `how to build a RAG pipeline`)
- `[도구] vs [도구]` (예: `scikit-learn vs pytorch for classification`)

## 4. E-E-A-T 전략

### Experience (경험)
- 프로젝트 케이스 스터디에 실제 데이터/결과 포함
- "Now" 섹션으로 현재 진행 중인 작업 공유
- 블로그에서 실무 경험 기반 인사이트 공유

### Expertise (전문성)
- 기술 스택과 역량을 구조화된 형태로 표시
- 코드 예제와 기술적 깊이 있는 블로그 포스트
- 프로젝트별 상세한 기술적 의사결정 과정 서술

### Authoritativeness (권위)
- GitHub, LinkedIn 프로필 연결 (sameAs)
- 외부 발표/기고 링크 추가
- 프로젝트의 실제 성과/임팩트 수치 포함

### Trustworthiness (신뢰성)
- 연락처 정보 명확히 표시
- 프로필 사진 포함
- 일관된 NAP (Name, Affiliation, Profile) 정보

## 5. 기술 SEO 개선 사항

### 즉시 수정 (Quick Wins)
1. **sitemap.ts**: `lastModified`를 실제 콘텐츠 수정일로 변경
2. **Article 스키마**: `dateModified`, `image` 필드 추가
3. **Project 페이지**: 스키마 마크업 추가 (CreativeWork)
4. **Breadcrumb 스키마**: 블로그/프로젝트 페이지에 추가
5. **WebSite 스키마**: 홈페이지에 추가

### 중기 개선
6. **llms.txt**: AI 크롤러용 파일 추가
7. **태그/카테고리 페이지**: 블로그 콘텐츠 분류
8. **내부 링크 강화**: 관련 포스트/프로젝트 연결
9. **RSS 피드**: 블로그 구독 기능

### 장기 개선
10. **다국어 지원**: 한국어 콘텐츠 (hreflang)
11. **검색 기능**: 사이트 내 검색
12. **뉴스레터**: 이메일 구독

## 6. 콘텐츠 전략 요약

### 콘텐츠 유형별 목표
| 유형 | 현재 | 6개월 목표 | 12개월 목표 |
|------|------|-----------|------------|
| 블로그 포스트 | 소수 | 12+ | 30+ |
| 프로젝트 케이스 스터디 | 소수 | 5+ | 10+ |
| 태그 페이지 | 0 | 5+ | 10+ |

### 발행 케이던스
- **블로그**: 격주 1편 (월 2편)
- **프로젝트**: 월 1편
- **"Now" 업데이트**: 월 1회

## 7. 경쟁 우위 전략

데이터 사이언티스트 포트폴리오 시장에서의 차별화:

1. **실전 케이스 스터디**: 단순 코드가 아닌 비즈니스 임팩트 중심 서술
2. **AI 시대 최적화**: GEO 최적화로 AI 검색에서 인용되는 콘텐츠
3. **기술적 깊이**: 표면적 튜토리얼이 아닌 의사결정 과정과 트레이드오프 분석
4. **지속적 업데이트**: "Now" 섹션과 정기 블로그로 활성화된 사이트 유지
