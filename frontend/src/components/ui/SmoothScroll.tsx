import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.25, // Extremely low for maximum smoothing / floaty effect
      wheelMultiplier: 0.8, // Slightly softer wheel translation
      smoothWheel: true,
      touchMultiplier: 1.5,
      autoRaf: true, // Use built-in requestAnimationFrame loop
    });

    lenisRef.current = lenis;

    // 2. If there's a hash in the URL on load (e.g. from cross-page navigation), scroll to it
    let timeoutId: number;
    if (window.location.hash) {
      timeoutId = window.setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash) as HTMLElement | null;
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: -72, immediate: true });
        }
      }, 100);
    }

    // 3. Intercept Anchor Link Clicks for smooth scrolling with offset
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        // Only prevent default if it's an internal # anchor
        if (anchor.hash !== '') {
          const targetElement = document.querySelector(anchor.hash) as HTMLElement | null;
          if (targetElement) {
            e.preventDefault();
            
            // Adjust offset to account for the fixed navbar height (72px)
            const offset = -72;
            
            lenis.scrollTo(targetElement, {
              offset,
              duration: 0.8, // Faster, snappier scrolling
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // 4. Cleanup on unmount
    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
