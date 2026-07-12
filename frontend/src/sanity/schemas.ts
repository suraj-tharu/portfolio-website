// Sanity Schema Definitions
// These need to be added to your Sanity Studio project.

export const blogSchema = {
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'mainImage' },
  },
};

export const learningMaterialSchema = {
  name: 'learningMaterial',
  title: 'Learning Materials',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'grade',
      title: 'Grade / Category',
      type: 'string',
      options: {
        list: [
          { title: 'Grade 10 (SEE)', value: 'Grade 10' },
          { title: 'Grade 11 (NEB)', value: 'Grade 11' },
          { title: 'Grade 12 (NEB)', value: 'Grade 12' },
          { title: 'Teacher Training', value: 'Teacher Training' },
          { title: 'Project', value: 'Project' },
          { title: 'Blog', value: 'Blog' },
        ],
      },
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      options: { accept: '.pdf' },
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'grade' },
  },
};
