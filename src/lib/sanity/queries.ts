// Home page
export const featuredProjectQuery = `
  *[_type == "project" && featured == true] | order(order asc)[0] {
    title, slug, description, techStack, links, image, order
  }
`;

export const recentPostsQuery = `
  *[_type == "post"] | order(publishedAt desc)[0...3] {
    title, slug, excerpt, publishedAt, image
  }
`;

export const authorBioQuery = `
  *[_type == "author"][0] {
    bio, socialLinks
  }
`;

// Blog
export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    title, slug, excerpt, publishedAt, tags, _updatedAt
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    title, slug, excerpt, body, publishedAt, _updatedAt, tags, image
  }
`;

// Projects
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    title, slug, description, body, techStack, links, image
  }
`;

// About
export const aboutQuery = `
  *[_type == "author"][0] {
    name, title, skills, nowContent, nowUpdatedAt, image
  }
`;

// Resume
export const resumeQuery = `
  *[_type == "resume"][0] {
    experience, education, skills,
    projects[]-> { title, slug, description }
  }
`;

export const resumePdfQuery = `
  *[_type == "author"][0] {
    "resumeUrl": resumePdf.asset->url
  }
`;

// Other projects (non-featured, for home sidebar)
export const otherProjectsQuery = `
  *[_type == "project" && featured != true] | order(order asc) {
    title, slug, description, image
  }
`;

// All projects (for sitemap + generateStaticParams)
export const allProjectsQuery = `
  *[_type == "project"] | order(order asc) { title, slug, _updatedAt }
`;
