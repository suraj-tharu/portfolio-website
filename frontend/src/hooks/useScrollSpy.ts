import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset: number = 200) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Find the element that is currently in view
      let currentId = '';
      for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i];
        if (id === '') {
          // Special case for top of page (home)
          if (scrollPosition < 500) {
             currentId = id;
             break;
          }
          continue;
        }

        const element = document.getElementById(id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;

          if (scrollPosition >= elementTop) {
            currentId = id;
            break;
          }
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset]);

  return activeId;
}
