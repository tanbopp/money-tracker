// Mobile Responsiveness Enhancements
(function() {
    'use strict';
    
    // Mobile viewport height fix for iOS Safari
    function setMobileViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Mobile touch events optimization
    function optimizeTouchEvents() {
        // Prevent double-tap zoom on buttons
        document.addEventListener('touchend', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                e.preventDefault();
                e.target.click();
            }
        });
        
        // Improve touch scrolling
        const scrollElements = document.querySelectorAll('.overflow-y-auto, .max-h-60');
        scrollElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    // Mobile keyboard handling
    function handleMobileKeyboard() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on focus for mobile
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    // Scroll to input with a delay to account for keyboard
                    setTimeout(() => {
                        this.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }, 300);
                }
            });
            
            // Fix for iOS Safari input focus issues
            input.addEventListener('blur', function() {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            });
        });
    }
    
    // Mobile-specific card optimizations
    function optimizeMobileCards() {
        if (window.innerWidth <= 640) {
            // Reduce padding on all cards for mobile
            const cards = document.querySelectorAll('.bg-white.rounded-lg, .wallet-card, .student-card');
            cards.forEach(card => {
                card.classList.add('mobile-p-2', 'mobile-mb-2');
            });
            
            // Optimize grid layouts for mobile
            const grids = document.querySelectorAll('.grid');
            grids.forEach(grid => {
                if (grid.classList.contains('grid-cols-3') || grid.classList.contains('grid-cols-4')) {
                    grid.classList.add('mobile-grid-2');
                }
            });
            
            // Make buttons more touch-friendly
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.minHeight = '44px';
                button.style.minWidth = '44px';
            });
        }
    }
    
    // Mobile modal optimizations
    function optimizeMobileModals() {
        const modals = document.querySelectorAll('[id$="-modal"]');
        
        modals.forEach(modal => {
            if (window.innerWidth <= 768) {
                const modalContent = modal.querySelector('.modal-content, [class*="modal-content"]');
                if (modalContent) {
                    modalContent.style.margin = '8px';
                    modalContent.style.maxHeight = '92vh';
                    modalContent.style.borderRadius = '16px 16px 0 0';
                }
            }
        });
    }
    
    // Mobile text size adjustments
    function adjustMobileTextSizes() {
        if (window.innerWidth <= 640) {
            // Adjust headers
            const headers = document.querySelectorAll('h1, h2, h3, .text-xl, .text-2xl');
            headers.forEach(header => {
                if (header.classList.contains('text-2xl')) {
                    header.classList.add('mobile-text-base');
                } else if (header.classList.contains('text-xl')) {
                    header.classList.add('mobile-text-sm');
                }
            });
            
            // Adjust small text
            const smallText = document.querySelectorAll('.text-sm, .text-xs');
            smallText.forEach(text => {
                if (text.classList.contains('text-sm')) {
                    text.classList.add('mobile-text-xs');
                }
            });
        }
    }
    
    // Responsive navigation handling
    function handleMobileNavigation() {
        const bottomNav = document.querySelector('.md\\:hidden.fixed.bottom-0');
        const mainContainer = document.querySelector('.main-container');
        
        if (bottomNav && mainContainer) {
            // Ensure main content doesn't overlap with bottom navigation
            const navHeight = bottomNav.offsetHeight;
            mainContainer.style.paddingBottom = `${navHeight + 20}px`;
        }
    }
    
    // Mobile swiper optimizations
    function optimizeMobileSwipers() {
        // Wait for Swiper initialization
        setTimeout(() => {
            const swipers = document.querySelectorAll('.swiper');
            swipers.forEach(swiper => {
                if (window.innerWidth <= 768) {
                    // Reduce space between slides on mobile
                    swiper.style.paddingBottom = '20px';
                }
            });
        }, 1000);
    }
    
    // Handle orientation changes
    function handleOrientationChange() {
        setTimeout(() => {
            setMobileViewportHeight();
            optimizeMobileCards();
            handleMobileNavigation();
        }, 100);
    }
    
    // Initialize all mobile optimizations
    function initMobileOptimizations() {
        setMobileViewportHeight();
        optimizeTouchEvents();
        handleMobileKeyboard();
        optimizeMobileCards();
        optimizeMobileModals();
        adjustMobileTextSizes();
        handleMobileNavigation();
        optimizeMobileSwipers();
        
        console.log('Mobile responsiveness enhancements loaded');
    }
    
    // Event listeners
    window.addEventListener('resize', () => {
        setMobileViewportHeight();
        optimizeMobileCards();
        handleMobileNavigation();
    });
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileOptimizations);
    } else {
        initMobileOptimizations();
    }
    
    // Re-run optimizations when new content is loaded
    const observer = new MutationObserver(() => {
        optimizeMobileCards();
        adjustMobileTextSizes();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
