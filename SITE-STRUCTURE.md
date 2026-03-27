# Site Structure — chopaul.com

> URL 계층 구조 및 사이트 아키텍처

## 현재 구조

```
chopaul.com/
├── /                          # 홈: 히어로, 주요 프로젝트, 최근 글, 소개
├── /about                     # 소개: 바이오, 스킬, Now 섹션
├── /blog                      # 블로그 목록
│   └── /blog/[slug]           # 개별 블로그 포스트
├── /projects/[slug]           # 프로젝트 케이스 스터디
├── /resume                    # 이력서
├── /studio/                   # Sanity CMS (noindex)
├── /api/revalidate            # ISR 재검증 (noindex)
├── /og                        # 동적 OG 이미지 (noindex)
├── /sitemap.xml               # 동적 사이트맵
└── /robots.txt                # 로봇 설정
```

## 제안 구조 (Phase 2 이후)

```
chopaul.com/
├── /                          # 홈
├── /about                     # 소개
├── /blog                      # 블로그 목록
│   ├── /blog/[slug]           # 개별 포스트
│   └── /blog/tag/[tag]        # 태그별 목록 ← NEW
├── /projects                  # 프로젝트 목록 ← NEW (선택)
│   └── /projects/[slug]       # 프로젝트 상세
├── /resume                    # 이력서
├── /feed.xml                  # RSS 피드 ← NEW
├── /llms.txt                  # AI 크롤러용 ← NEW
├── /sitemap.xml               # 사이트맵
└── /robots.txt                # 로봇 설정
```

## URL 설계 원칙

1. **간결함**: 불필요한 중첩 없이 최대 2 depth
2. **의미 전달**: slug는 콘텐츠를 설명 (예: `/blog/rag-pipeline-guide`)
3. **일관성**: kebab-case, 소문자, trailing slash 없음
4. **영구성**: 한번 발행된 URL은 변경하지 않음

## 내부 링크 전략

### 허브-스포크 모델
```
/blog (허브)
├── /blog/rag-pipeline-guide (스포크)
├── /blog/llm-fine-tuning-tips (스포크)
└── /blog/embedding-models-compared (스포크)
    ↕ 상호 링크 ↕
```

### 크로스 링크 규칙
- 모든 블로그 포스트 → 관련 프로젝트 (있을 경우)
- 모든 프로젝트 → 관련 블로그 포스트 (있을 경우)
- About 페이지 → 주요 프로젝트 3개
- 홈 → 최신 블로그 3개 + 주요 프로젝트 1개 (이미 구현됨)

### Breadcrumb 구조
```
홈 > 블로그 > [포스트 제목]
홈 > 프로젝트 > [프로젝트 제목]
```

## 페이지별 스키마 매핑

| 페이지 | 스키마 유형 | 상태 |
|--------|-----------|------|
| `/` | `Person`, `WebSite` | ⚠️ Person만 있음 |
| `/about` | `ProfilePage`, `Person` | ❌ 없음 |
| `/blog` | `CollectionPage` | ❌ 없음 |
| `/blog/[slug]` | `Article`, `BreadcrumbList` | ⚠️ Article만 있음 |
| `/blog/tag/[tag]` | `CollectionPage` | 🆕 페이지 자체가 없음 |
| `/projects/[slug]` | `CreativeWork`, `BreadcrumbList` | ❌ 없음 |
| `/resume` | `ProfilePage` | ❌ 없음 |

## Sitemap 구조

### 현재
- 정적 페이지: `/`, `/about`, `/blog`, `/resume`
- 동적 페이지: `/blog/[slug]`, `/projects/[slug]`

### 개선 후
- 위 모두 + `/blog/tag/[tag]` 페이지
- `lastModified`: 실제 Sanity `_updatedAt` 사용
- `priority`: 홈(1.0), 블로그 목록(0.8), 개별 포스트(0.7), 프로젝트(0.7), 태그(0.5)
