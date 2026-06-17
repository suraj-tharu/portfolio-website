# Quick Integration Guide - Copy & Paste Code Snippets

## 🎯 How to Add Features to Your Existing Components

### 1. Add Glassmorphism to Any Component

Replace your existing card/container with:

```tsx
import Glassmorphic from '../components/Glassmorphic';

export default function YourComponent() {
  return (
    <Glassmorphic className="p-8 rounded-2xl">
      {/* Your existing content */}
    </Glassmorphic>
  );
}
```

### 2. Add Progressive Images to Hero/About Section

**Before:**
```tsx
<img src="/image.jpg" alt="description" />
```

**After:**
```tsx
import ProgressiveImage from '../components/ProgressiveImage';

<ProgressiveImage
  src="/image.jpg"
  placeholder="/image-blur.jpg"
  alt="description"
/>
```

### 3. Add Meta Tags to Any Page

**Add at the top of your component:**
```tsx
import { setMetaTags } from '../utils/metaTags';
import { useEffect } from 'react';

export default function MyPage() {
  useEffect(() => {
    setMetaTags({
      title: 'Page Title',
      description: 'Page description',
      image: 'https://domain.com/image.jpg',
      keywords: ['keyword1', 'keyword2']
    });
  }, []);

  return (
    // Your component
  );
}
```

### 4. Add JSON-LD Schema to Components

**For Product/Service:**
```tsx
import { addJsonLdSchema, articleSchema } from '../utils/jsonLdSchema';

useEffect(() => {
  addJsonLdSchema(articleSchema({
    title: 'Article Title',
    description: 'Article description',
    datePublished: new Date().toISOString(),
    author: 'Author Name'
  }));
}, []);
```

### 5. Track User Events in Forms

```tsx
import { trackFormInteraction, trackEvent } from '../utils/analytics';

export default function ContactForm() {
  const handleSubmit = (e) => {
    trackFormInteraction('contact-form', 'submitted');
    trackEvent('form_submission', { form: 'contact' });
    // Your submission logic
  };

  const handleFocus = () => {
    trackFormInteraction('contact-form', 'started');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onFocus={handleFocus} />
      {/* Form fields */}
    </form>
  );
}
```

### 6. Add Lazy Loading to Image Gallery

```tsx
import { useLazyLoad } from '../hooks/useLazyLoad';

export default function ImageGallery({ images }) {
  return (
    <div className="grid">
      {images.map((img) => (
        <LazyImage key={img.id} src={img.src} />
      ))}
    </div>
  );
}

function LazyImage({ src }) {
  const { ref, isVisible } = useLazyLoad();
  
  return (
    <div ref={ref}>
      {isVisible && <img src={src} alt="" loading="lazy" />}
    </div>
  );
}
```

### 7. Add Resume Export Button

Create a new component or add to existing:

```tsx
import ResumeExport from '../components/ResumeExport';

const resumeData = {
  fullName: 'Suraj Tharu Chaudhary',
  email: 'suraj@example.com',
  phone: '+977-1234567890',
  location: 'Nepal',
  summary: 'Your professional summary',
  experience: [
    {
      title: 'Senior Instructor',
      company: 'Trishahid Namuna Ma. Vi.',
      startDate: '2024',
      endDate: 'Present',
      description: 'Teaching and research'
    }
  ],
  education: [
    {
      degree: 'MSc Information System Engineering',
      institution: 'Purbanchal University',
      year: '2024'
    }
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Tailwind CSS']
    }
  ],
  certifications: []
};

export default function ResumePage() {
  return (
    <>
      <ResumeExport resumeData={resumeData} />
      {/* Rest of page */}
    </>
  );
}
```

### 8. Add FAQ to Footer or Dedicated Section

```tsx
import FAQ from '../components/FAQ';

export default function FAQPage() {
  return (
    <div>
      <FAQ />
    </div>
  );
}
```

### 9. Add Email Subscription to Landing Page

```tsx
import EmailSubscription from '../components/EmailSubscription';

export default function LandingPage() {
  return (
    <div>
      <section>Your content</section>
      <EmailSubscription />
      <section>More content</section>
    </div>
  );
}
```

### 10. Add Scroll Spy Navigation

**In your Navbar component, add:**
```tsx
import { useScrollSpy } from '../hooks/useThemeAnimation';

export default function Navbar() {
  useScrollSpy();
  
  return (
    <nav>
      <a href="#section1">Section 1</a>
      <a href="#section2">Section 2</a>
      {/* Links will auto-highlight based on scroll */}
    </nav>
  );
}
```

---

## 🔌 API Integration Examples

### Email Subscription Backend

**Node.js/Express Example:**
```javascript
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  // Validate email
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  // Save to database or email service
  try {
    // Example with Mailchimp
    const result = await mailchimp.lists.members.create('list-id', {
      email_address: email,
      status: 'subscribed'
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Analytics Custom Events

**Track Specific Actions:**
```typescript
// Track video plays
function VideoPlayer({ videoId }) {
  const handlePlay = () => {
    trackEvent('video_play', {
      videoId,
      timestamp: new Date().toISOString()
    });
  };
  
  return <video onPlay={handlePlay} />;
}

// Track section views
function Section({ name }) {
  useEffect(() => {
    trackEvent('section_view', { section: name });
  }, [name]);
  
  return <section>{/* content */}</section>;
}

// Track external links
function ExternalLink({ url, label }) {
  const handleClick = () => {
    trackEvent('external_link_click', {
      url,
      label,
      page: window.location.pathname
    });
  };
  
  return <a href={url} onClick={handleClick}>{label}</a>;
}
```

---

## 📱 Mobile-First Tips

Ensure all new components work on mobile:

```tsx
// Use Tailwind breakpoints
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl md:text-4xl lg:text-6xl">
    Responsive title
  </h1>
</div>

// Test touch interactions
const handleTouchEnd = (e) => {
  trackEvent('touch_end', { element: e.target.id });
};

// Optimize images for mobile
<ProgressiveImage
  src="/image.jpg"
  placeholder="/image-thumb.jpg"
  containerClassName="w-full h-auto"
/>
```

---

## ✅ Testing Checklist

Before deploying, verify:

- [ ] Analytics IDs are set (check console for errors)
- [ ] Meta tags appear in page source
- [ ] JSON-LD schema validates at schema.org
- [ ] Glassmorphism appears in dark & light modes
- [ ] FAQ schema shows in Google Rich Results
- [ ] Email subscription form submits
- [ ] Resume exports work (PDF, Word, JSON, ATS)
- [ ] FloatingActionButton appears on all pages
- [ ] Lazy loading works (check Network tab)
- [ ] Service worker caches assets
- [ ] Dark mode transitions smoothly
- [ ] All animations perform at 60fps

---

## 🎨 Customization Examples

### Change FAB Colors

**File:** `frontend/src/components/FloatingActionButton.tsx`
```tsx
const menuItems = [
  {
    color: 'bg-blue-500', // Change this
    // ...
  }
];
```

### Customize Glassmorphism Blur

```tsx
<Glassmorphic blur="xl" opacity="high">
  More blurred and visible
</Glassmorphic>
```

### Change Theme Animation Speed

**File:** `frontend/src/hooks/useThemeAnimation.ts`
```typescript
transition: background-color 0.5s ease, // Change 0.3s to desired duration
```

### Customize FAQ Default Items

**File:** `frontend/src/components/FAQ.tsx`
- Edit `defaultFAQs` array

---

## 📚 Documentation Files

- `PREMIUM_FEATURES_GUIDE.md` - Complete feature documentation
- `IMPLEMENTATION_SETUP.md` - Setup and configuration guide
- `QUICK_INTEGRATION.md` - This file with copy-paste snippets

---

**Your website is now equipped with enterprise-grade features! 🚀**
