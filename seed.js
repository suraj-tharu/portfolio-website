const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Idempotent upsert — safe to run multiple times without creating duplicates
  await prisma.project.upsert({
    where: { title: 'Global Earthquake Analyzer' },
    update: {},
    create: {
      title: 'Global Earthquake Analyzer',
      description: 'An advanced GIS platform mapping real-time seismic events using USGS data. Features heatmaps and timeline scrubbers.',
      imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'QGIS, React, Python'
    }
  });

  await prisma.project.upsert({
    where: { title: 'Forest Cover Prediction' },
    update: {},
    create: {
      title: 'Forest Cover Prediction',
      description: 'Machine learning pipeline for classifying satellite imagery and predicting deforestation using Random Forests.',
      imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Google Earth Engine, ML'
    }
  });

  await prisma.project.upsert({
    where: { title: 'Urban Heat Island Modeler' },
    update: {},
    create: {
      title: 'Urban Heat Island Modeler',
      description: 'Spatial analysis tool calculating land surface temperature from Landsat 8 thermal bands.',
      imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'GDAL, RasterIO'
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: 'mastering-qgis-python' },
    update: {},
    create: {
      title: 'Mastering QGIS with Python',
      slug: 'mastering-qgis-python',
      content: '<p>A deep dive into automating QGIS workflows using PyQGIS...</p>',
      published: true
    }
  });

  console.log('✅ Database seeded (idempotent)!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
