// Main JavaScript functionality for George Wanjohi's Portfolio
// Handles navigation, animations, form validation, and interactions

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const contactForm = document.getElementById('contactForm');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initContactForm();
        initSmoothScrolling();
        initAccessibility();
    });

    // Navigation functionality
    function initNavigation() {
        if (!mobileMenuToggle || !navMenu) return;

        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Scroll effects for header and animations
    function initScrollEffects() {
        if (!header) return;

        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Header scroll effect
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show scroll indicator
            if (scrollIndicator) {
                if (scrollTop > window.innerHeight * 0.3) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            }

            lastScrollTop = scrollTop;
        });
    }

    // Intersection Observer for scroll animations
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Contact form functionality
    function initContactForm() {
        if (!contactForm) return;

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';

            // Simulate form submission
            setTimeout(function() {
                // Hide form and show success message
                contactForm.style.display = 'none';
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline-flex';
                btnLoading.style.display = 'none';

                // Reset form
                contactForm.reset();
                clearErrors();
            }, 2000);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Form validation
    function validateForm() {
        const fields = [
            { id: 'name', name: 'Full Name' },
            { id: 'email', name: 'Email Address' },
            { id: 'subject', name: 'Subject' },
            { id: 'message', name: 'Message' }
        ];

        let isValid = true;
        clearErrors();

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!validateField(element)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.placeholder || field.id;
        const errorElement = document.getElementById(field.id + 'Error');

        // Clear previous error
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }

        // Required field validation
        if (field.required && !value) {
            showError(field, errorElement, `${fieldName} is required`);
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
        }

        // Minimum length validation
        if (field.id === 'message' && value.length < 10) {
            showError(field, errorElement, 'Message must be at least 10 characters long');
            return false;
        }

        return true;
    }

    function showError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const errorFields = document.querySelectorAll('.error');

        errorMessages.forEach(error => {
            error.textContent = '';
        });

        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Accessibility enhancements
    function initAccessibility() {
        // Add keyboard navigation for mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Add focus management for modal-like interactions
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        // Trap focus in mobile menu when open
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                mobileMenuToggle.click();
                mobileMenuToggle.focus();
            }

            // Tab navigation in mobile menu
            if (e.key === 'Tab' && navMenu && navMenu.classList.contains('active')) {
                const focusable = navMenu.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });

        // Add ARIA labels dynamically
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            if (!link.getAttribute('aria-label')) {
                const href = link.getAttribute('href');
                if (href.includes('github')) {
                    link.setAttribute('aria-label', 'GitHub Profile');
                } else if (href.includes('linkedin')) {
                    link.setAttribute('aria-label', 'LinkedIn Profile');
                } else if (href.includes('mailto:')) {
                    link.setAttribute('aria-label', 'Email Contact');
                }
            }
        });
    }

    // Utility function to debounce events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimization: Debounced scroll handler
    const debouncedScrollHandler = debounce(function() {
        // Additional scroll optimizations can be added here
    }, 16); // ~60fps

    window.addEventListener('scroll', debouncedScrollHandler);

    // Export functions for potential external use
    window.PortfolioUtils = {
        validateForm: validateForm,
        validateField: validateField,
        clearErrors: clearErrors,
        debounce: debounce
    };

})();
