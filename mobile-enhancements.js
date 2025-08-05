// Mobile-specific enhancements for Money Tracker
// Enhanced touch interactions and mobile-friendly UX improvements

// Prevent zoom on double tap for form inputs
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

// Enhanced mobile dropdown functionality
function openMobileCategoryDropdown() {
    const dropdown = document.getElementById('mobile-category-dropdown');
    const arrow = document.getElementById('mobile-category-arrow');
    
    if (dropdown && arrow) {
        dropdown.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        
        // Close on backdrop click
        setTimeout(() => {
            document.addEventListener('click', closeCategoryOnClickOutside, true);
        }, 100);
        
        // Prevent body scroll when dropdown is open
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileCategoryDropdown() {
    const dropdown = document.getElementById('mobile-category-dropdown');
    const arrow = document.getElementById('mobile-category-arrow');
    
    if (dropdown && arrow) {
        dropdown.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', closeCategoryOnClickOutside, true);
        document.body.style.overflow = '';
    }
}

function closeCategoryOnClickOutside(event) {
    const dropdown = document.getElementById('mobile-category-dropdown');
    const trigger = document.getElementById('mobile-category-trigger');
    
    if (dropdown && trigger && 
        !dropdown.contains(event.target) && 
        !trigger.contains(event.target)) {
        closeMobileCategoryDropdown();
    }
}

// Enhanced mobile wallet dropdown functionality
function openMobileWalletDropdown() {
    const dropdown = document.getElementById('mobile-wallet-dropdown');
    const arrow = document.getElementById('mobile-wallet-arrow');
    
    if (dropdown && arrow) {
        dropdown.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        
        // Close on backdrop click
        setTimeout(() => {
            document.addEventListener('click', closeWalletOnClickOutside, true);
        }, 100);
        
        // Prevent body scroll when dropdown is open
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileWalletDropdown() {
    const dropdown = document.getElementById('mobile-wallet-dropdown');
    const arrow = document.getElementById('mobile-wallet-arrow');
    
    if (dropdown && arrow) {
        dropdown.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', closeWalletOnClickOutside, true);
        document.body.style.overflow = '';
    }
}

function closeWalletOnClickOutside(event) {
    const dropdown = document.getElementById('mobile-wallet-dropdown');
    const trigger = document.getElementById('mobile-wallet-trigger');
    
    if (dropdown && trigger && 
        !dropdown.contains(event.target) && 
        !trigger.contains(event.target)) {
        closeMobileWalletDropdown();
    }
}

// Enhanced mobile menu functionality
function showMobileMenu() {
    const modal = document.getElementById('mobile-menu-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Add backdrop click handler
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideMobileMenu();
            }
        });
    }
}

function hideMobileMenu() {
    const modal = document.getElementById('mobile-menu-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Enhanced quick add modal functionality
function showQuickAddModal() {
    const modal = document.getElementById('quick-add-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Add backdrop click handler
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideQuickAddModal();
            }
        });
    }
}

function hideQuickAddModal() {
    const modal = document.getElementById('quick-add-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('quick-transaction-form');
        const formContainer = document.getElementById('quick-form-container');
        if (form && formContainer) {
            form.reset();
            formContainer.classList.add('hidden');
        }
        
        // Close any open dropdowns
        closeMobileCategoryDropdown();
        closeMobileWalletDropdown();
    }
}

// Enhanced mobile navigation with better visual feedback
function updateMobileNavigation(activeSection) {
    const navButtons = document.querySelectorAll('.mobile-nav-btn');
    
    navButtons.forEach(button => {
        button.classList.remove('text-primary');
        button.classList.add('text-gray-600', 'dark:text-gray-400');
        
        // Find the icon and span elements
        const icon = button.querySelector('i');
        const span = button.querySelector('span');
        
        if (icon) {
            icon.classList.remove('text-primary');
            icon.classList.add('text-gray-600', 'dark:text-gray-400');
        }
        
        if (span) {
            span.classList.remove('text-primary');
            span.classList.add('text-gray-600', 'dark:text-gray-400');
        }
    });
    
    // Activate the current section button
    const activeButton = document.querySelector(`[onclick="showSection('${activeSection}')"]`);
    if (activeButton && activeButton.classList.contains('mobile-nav-btn')) {
        activeButton.classList.remove('text-gray-600', 'dark:text-gray-400');
        activeButton.classList.add('text-primary');
        
        const icon = activeButton.querySelector('i');
        const span = activeButton.querySelector('span');
        
        if (icon) {
            icon.classList.remove('text-gray-600', 'dark:text-gray-400');
            icon.classList.add('text-primary');
        }
        
        if (span) {
            span.classList.remove('text-gray-600', 'dark:text-gray-400');
            span.classList.add('text-primary');
        }
    }
}

// Touch feedback for buttons
function addTouchFeedback() {
    const touchElements = document.querySelectorAll('.touch-manipulation');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.8';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
}

// Prevent iOS rubber band scrolling when modal is open
function preventOverscroll() {
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        const modal = document.querySelector('.modal-container:not(.hidden)');
        if (modal) {
            const scrollable = e.target.closest('.overflow-y-auto, .max-h-60, .max-h-\\[90vh\\]');
            
            if (!scrollable) {
                e.preventDefault();
                return;
            }
            
            const scrollTop = scrollable.scrollTop;
            const scrollHeight = scrollable.scrollHeight;
            const clientHeight = scrollable.clientHeight;
            const deltaY = e.touches[0].clientY - startY;
            
            if ((scrollTop === 0 && deltaY > 0) || 
                (scrollTop + clientHeight >= scrollHeight && deltaY < 0)) {
                e.preventDefault();
            }
        }
    }, { passive: false });
}

// Auto-resize input fields for better mobile UX
function enhanceInputFields() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"], textarea');
    
    inputs.forEach(input => {
        // Add touch-friendly styling
        input.addEventListener('focus', function() {
            this.style.borderColor = '#4F46E5';
            this.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
        
        // Auto-format number inputs
        if (input.type === 'number') {
            input.addEventListener('input', function() {
                // Remove any non-numeric characters except decimal point
                let value = this.value.replace(/[^\d.]/g, '');
                
                // Ensure only one decimal point
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                
                this.value = value;
            });
        }
    });
}

// Initialize mobile enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addTouchFeedback();
    preventOverscroll();
    enhanceInputFields();
    
    // Add swipe gestures for modal dismissal
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const diffX = startX - e.touches[0].clientX;
        const diffY = startY - e.touches[0].clientY;
        
        // Check if it's a vertical swipe down on modal
        if (Math.abs(diffY) > Math.abs(diffX) && diffY < -100) {
            const modal = e.target.closest('.modal-container:not(.hidden)');
            if (modal) {
                if (modal.id === 'mobile-menu-modal') {
                    hideMobileMenu();
                } else if (modal.id === 'quick-add-modal') {
                    hideQuickAddModal();
                }
            }
        }
        
        startX = 0;
        startY = 0;
    });
});

// Handle orientation changes for better mobile experience
window.addEventListener('orientationchange', function() {
    // Close any open modals/dropdowns on orientation change
    setTimeout(function() {
        closeMobileCategoryDropdown();
        closeMobileWalletDropdown();
        
        // Recalculate modal heights if needed
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.maxHeight = '90vh';
        });
    }, 100);
});

// Handle safe area for devices with notches
if (CSS.supports('padding: env(safe-area-inset-bottom)')) {
    document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
} else {
    document.documentElement.style.setProperty('--safe-area-bottom', '0px');
}

// Export functions for use in main script
window.mobileEnhancements = {
    showMobileMenu,
    hideMobileMenu,
    showQuickAddModal,
    hideQuickAddModal,
    openMobileCategoryDropdown,
    closeMobileCategoryDropdown,
    openMobileWalletDropdown,
    closeMobileWalletDropdown,
    updateMobileNavigation
};
