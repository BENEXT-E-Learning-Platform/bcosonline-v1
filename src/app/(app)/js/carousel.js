document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('courses-carousel');
    if (!carousel) return; // Safety check
    
    const container = carousel.parentElement;
    const cards = carousel.children;
    const totalCards = cards.length;
    const dots = document.querySelectorAll('.flex.justify-center.mt-6 button');
    
    let currentIndex = 0;
    let autoScrollInterval;
    let visibleCards = 1; // Default for mobile
    let maxIndex = 0;
    
    // Determine how many cards to show based on screen width
    function updateVisibleCards() {
      if (window.innerWidth >= 1024) {
        visibleCards = 3; // Desktop
      } else if (window.innerWidth >= 640) {
        visibleCards = 2; // Tablet
      } else {
        visibleCards = 1; // Mobile
      }
      
      // Update max index to prevent empty slides
      maxIndex = Math.max(0, totalCards - visibleCards);
      
      // Force current index to be valid
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      
      // Update scroll position
      scrollToIndex(currentIndex);
    }
    
    function scrollToIndex(index) {
      // Prevent scrolling to empty slides
      if (index < 0) index = 0;
      if (index > maxIndex) index = maxIndex;
      
      currentIndex = index;
      
      // Calculate card width based on container and visible cards
      const cardWidth = container.offsetWidth / visibleCards;
      
      // Scroll to position
      carousel.style.transform = `translateX(${-cardWidth * currentIndex}px)`;
      
      // Update active dot
      dots.forEach((dot, i) => {
        if (i <= maxIndex) {
          dot.classList.toggle('bg-[#253b74]', i === currentIndex);
          dot.classList.toggle('bg-gray-300', i !== currentIndex);
        }
      });
    }
    
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex > maxIndex) nextIndex = 0;
        scrollToIndex(nextIndex);
      }, 5000); // Scroll every 5 seconds
    }
    
    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }
    
    // Initialize dots click events
    dots.forEach((dot, i) => {
      if (i <= maxIndex) {
        dot.addEventListener('click', () => {
          scrollToIndex(i);
          stopAutoScroll();
          startAutoScroll(); // Restart auto-scrolling after user interaction
        });
      }
    });
    
    // Left and right arrow click events
    const leftArrow = document.querySelector('button.absolute.left-0');
    const rightArrow = document.querySelector('button.absolute.right-0');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
        stopAutoScroll();
        startAutoScroll();
      });
    }
    
    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
        stopAutoScroll();
        startAutoScroll();
      });
    }
    
    // Pause auto-scrolling when hovering over the carousel
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
    
    // Initialize responsive behavior
    window.addEventListener('resize', updateVisibleCards);
    updateVisibleCards();
    
    // Start auto-scrolling initially
    startAutoScroll();
  });