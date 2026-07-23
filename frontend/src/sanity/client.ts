import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'lbzty0k5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,          // false = uses api.sanity.io (has CORS headers), true = CDN (no CORS for localhost)
  withCredentials: false, // public read — no auth needed
});

// GROQ query helpers
export const BLOG_QUERY = `
  *[_type == "blog"] | order(publishedAt desc) [0...10] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    "imageUrl": mainImage.asset->url,
    excerpt
  }
`;

export const LEARNING_MATERIAL_QUERY = `
  *[_type == "learningMaterial"] | order(_createdAt desc) {
    _id,
    title,
    grade,
    subject,
    description,
    "pdfUrl": pdfFile.asset->url,
    _createdAt
  }
`;
