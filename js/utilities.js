// Utility functions for George Wanjohi's Portfolio
// Contains helper functions for common operations

(function() {
    'use strict';

    // String utilities
    const StringUtils = {
        // Capitalize first letter of each word
        capitalize: function(str) {
            return str.replace(/\b\w/g, function(char) {
                return char.toUpperCase();
            });
        },

        // Convert string to slug format
        slugify: function(str) {
            return str
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },

        // Truncate string with ellipsis
        truncate: function(str, length, suffix = '...') {
            if (str.length <= length) return str;
            return str.substring(0, length - suffix.length) + suffix;
        },

        // Remove HTML tags from string
        stripHtml: function(str) {
            const tmp = document.createElement('div');
            tmp.innerHTML = str;
            return tmp.textContent || tmp.innerText || '';
        }
    };

    // Array utilities
    const ArrayUtils = {
        // Remove duplicates from array
        unique: function(arr) {
            return [...new Set(arr)];
        },

        // Shuffle array elements
        shuffle: function(arr) {
            const shuffled = [...arr];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        // Group array elements by property
        groupBy: function(arr, key) {
            return arr.reduce(function(groups, item) {
                const val = item[key];
                groups[val] = groups[val] || [];
                groups[val].push(item);
                return groups;
            }, {});
        },

        // Find item in array by property
        findBy: function(arr, key, value) {
            return arr.find(function(item) {
                return item[key] === value;
            });
        }
    };

    // DOM utilities
    const DOMUtils = {
        // Create element with attributes and content
        createElement: function(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            Object.keys(attributes).forEach(function(attr) {
                element.setAttribute(attr, attributes[attr]);
            });
            if (content) {
                element.textContent = content;
            }
            return element;
        },

        // Add multiple event listeners to element
        addEventListeners: function(element, events) {
            Object.keys(events).forEach(function(event) {
                element.addEventListener(event, events[event]);
            });
        },

        // Get element's position relative to viewport
        getPosition: function(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset,
                width: rect.width,
                height: rect.height
            };
        },

        // Check if element is in viewport
        isInViewport: function(element, threshold = 0) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            return (
                rect.top >= -threshold &&
                rect.left >= -threshold &&
                rect.bottom <= windowHeight + threshold &&
                rect.right <= windowWidth + threshold
            );
        },

        // Smooth scroll to element
        scrollTo: function(element, offset = 0) {
            const elementPosition = this.getPosition(element);
            const offsetPosition = elementPosition.top - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Date utilities
    const DateUtils = {
        // Format date to readable string
        format: function(date, options = {}) {
            const defaultOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date(date).toLocaleDateString(undefined, {...defaultOptions, ...options});
        },

        // Get relative time (e.g., "2 days ago")
        relative: function(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

            const intervals = [
                { label: 'year', seconds: 31536000 },
                { label: 'month', seconds: 2592000 },
                { label: 'week', seconds: 604800 },
                { label: 'day', seconds: 86400 },
                { label: 'hour', seconds: 3600 },
                { label: 'minute', seconds: 60 },
                { label: 'second', seconds: 1 }
            ];

            for (const interval of intervals) {
                const count = Math.floor(diffInSeconds / interval.seconds);
                if (count > 0) {
                    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
                }
            }

            return 'Just now';
        },

        // Check if date is today
        isToday: function(date) {
            const today = new Date();
            const checkDate = new Date(date);
            return today.toDateString() === checkDate.toDateString();
        }
    };

    // Animation utilities
    const AnimationUtils = {
        // Fade in element
        fadeIn: function(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';

            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.min(progress / duration, 1);
                element.style.opacity = opacity;

                if (progress < duration) {
                    requestAnimationFrame(animate);
                }
            }
            requestAnimationFrame(animate);
        },

        // Fade out element
        fadeOut: function(element, duration = 300) {
            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.max(1 - progress / duration, 0);
                element.style.opacity = opacity;

                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            }
            requestAnimationFrame(animate);
        },

        // Slide down element
        slideDown: function(element, duration = 300) {
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.display = 'block';

            const targetHeight = element.scrollHeight;
            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const height = Math.min(progress / duration * targetHeight, targetHeight);
                element.style.height = height + 'px';

                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = 'auto';
                }
            }
            requestAnimationFrame(animate);
        },

        // Slide up element
        slideUp: function(element, duration = 300) {
            const originalHeight = element.scrollHeight;
            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const height = Math.max(originalHeight - progress / duration * originalHeight, 0);
                element.style.height = height + 'px';
                element.style.overflow = 'hidden';

                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = 'auto';
                }
            }
            requestAnimationFrame(animate);
        }
    };

    // Storage utilities
    const StorageUtils = {
        // Get item from localStorage with JSON parsing
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Error reading from localStorage:', error);
                return defaultValue;
            }
        },

        // Set item in localStorage with JSON stringifying
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Error writing to localStorage:', error);
                return false;
            }
        },

        // Remove item from localStorage
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('Error removing from localStorage:', error);
                return false;
            }
        },

        // Clear all localStorage
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('Error clearing localStorage:', error);
                return false;
            }
        }
    };

    // Validation utilities
    const ValidationUtils = {
        // Validate email address
        isEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Validate URL
        isUrl: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        // Validate phone number (basic)
        isPhone: function(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        },

        // Validate required field
        isRequired: function(value) {
            return value !== null && value !== undefined && value.toString().trim().length > 0;
        },

        // Validate minimum length
        minLength: function(value, min) {
            return value.toString().length >= min;
        },

        // Validate maximum length
        maxLength: function(value, max) {
            return value.toString().length <= max;
        }
    };

    // Export utilities to global scope
    window.Utils = {
        String: StringUtils,
        Array: ArrayUtils,
        DOM: DOMUtils,
        Date: DateUtils,
        Animation: AnimationUtils,
        Storage: StorageUtils,
        Validation: ValidationUtils
    };

})();
