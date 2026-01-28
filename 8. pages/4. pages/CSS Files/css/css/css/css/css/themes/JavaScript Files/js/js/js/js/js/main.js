// Main JavaScript file - Core functionality
// Integrates all modules

class JobPortal {
    constructor() {
        this.modules = {};
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.initializeComponents();
        this.checkAuthStatus();
        this.initializeModules();
    }
    
    // Initialize all modules
    initializeModules() {
        // Initialize Jobs Manager
        if (typeof JobsManager !== 'undefined') {
            this.modules.jobs = new JobsManager();
        }
        
        // Initialize Auth Manager
        if (typeof AuthManager !== 'undefined') {
            this.modules.auth = new AuthManager();
        }
        
        // Initialize UI Manager
        if (typeof UIManager !== 'undefined') {
            this.modules.ui = new UIManager();
        }
        
        // Initialize Utils
        if (typeof Utils !== 'undefined') {
            this.modules.utils = new Utils();
        }
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.navbar-toggler')) {
                this.toggleMobileMenu();
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
        
        // Language switcher
        document.addEventListener('click', (e) => {
            if (e.target.matches('.lang-switch')) {
                this.switchLanguage(e.target.dataset.lang);
            }
        });
        
        // Job search form
        const searchForm = document.querySelector('.job-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleJobSearch(e.target);
            });
        }
        
        // Newsletter subscription
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(e.target);
            });
        }
        
        // Employer registration
        const employerForm = document.querySelector('.employer-form');
        if (employerForm) {
            employerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmployerRegistration(e.target);
            });
        }
    }
    
    toggleMobileMenu() {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar) {
            navbar.classList.toggle('show');
        }
    }
    
    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateAPIRequest();
            
            // Show success message
            this.showNotification('Success!', 'Form submitted successfully.', 'success');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            this.showNotification('Error!', 'Something went wrong. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // Handle job search
    async handleJobSearch(form) {
        const formData = new FormData(form);
        const filters = Object.fromEntries(formData);
        
        // Update jobs manager filters if available
        if (this.modules.jobs) {
            this.modules.jobs.applyFilters(filters);
        }
        
        // Show loading
        this.showLoading('Searching for jobs...');
        
        try {
            // Simulate search delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Show results count
            const jobs = this.modules.jobs ? this.modules.jobs.getFilteredJobs() : [];
            this.showNotification('Search Complete', `Found ${jobs.length} jobs matching your criteria.`, 'success');
            
        } finally {
            this.hideLoading();
        }
    }
    
    // Handle newsletter subscription
    async handleNewsletterSubscription(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email || !this.validateEmail(email)) {
            this.showNotification('Invalid Email', 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Save subscription to localStorage
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        }
        
        // Show success
        this.showNotification('Subscribed!', 'You have been added to our newsletter list.', 'success');
        form.reset();
    }
    
    // Handle employer registration
    async handleEmployerRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const required = ['company', 'email', 'phone'];
        const missing = required.filter(field => !data[field] || !data[field].trim());
        
        if (missing.length > 0) {
            this.showNotification('Missing Information', `Please fill in: ${missing.join(', ')}`, 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        submitBtn.disabled = true;
        
        try {
            // Simulate registration
            await this.simulateAPIRequest();
            
            // Save employer registration
            const employers = JSON.parse(localStorage.getItem('employerRegistrations') || '[]');
            employers.push({
                ...data,
                registeredDate: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('employerRegistrations', JSON.stringify(employers));
            
            // Show success
            this.showNotification(
                'Registration Submitted!',
                'Your employer account request has been submitted. We will contact you shortly.',
                'success'
            );
            
            // Reset form
            form.reset();
            
        } catch (error) {
            this.showNotification('Registration Failed', 'Please try again or contact support.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateAPIRequest() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }
    
    showNotification(title, message, type = 'info') {
        // Try to use UI manager if available
        if (this.modules.ui) {
            this.modules.ui.showNotification(title, message, type);
            return;
        }
        
        // Fallback to original implementation
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.notifications') || document.body;
        container.prepend(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    loadUserPreferences() {
        // Load theme preference
        const theme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', theme === 'dark');
        
        // Load language preference
        const lang = localStorage.getItem('language') || 'en';
        this.setLanguage(lang);
        
        // Load other preferences
        this.loadPreferences();
    }
    
    setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        
        // Update language switcher
        document.querySelectorAll('.lang-switch').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Trigger language change event
        document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
    }
    
    switchLanguage(lang) {
        if (lang !== this.currentLanguage) {
            this.setLanguage(lang);
            this.showNotification('Language Changed', `Switched to ${lang.toUpperCase()}`, 'info');
        }
    }
    
    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.user = JSON.parse(user);
            this.updateAuthUI(true);
        } else {
            this.updateAuthUI(false);
        }
    }
    
    updateAuthUI(isLoggedIn) {
        const loginBtn = document.querySelector('.login-btn');
        const userMenu = document.querySelector('.user-menu');
        
        if (isLoggedIn && this.user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.querySelector('.user-name').textContent = this.user.name;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
    
    initializeComponents() {
        // Initialize tooltips if Bootstrap is available
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
            
            // Initialize popovers
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
        } else {
            // Initialize custom tooltips
            this.initCustomTooltips();
        }
        
        // Initialize lazy loading for images
        this.initLazyLoading();
        
        // Initialize analytics
        this.initAnalytics();
    }
    
    initCustomTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const title = e.target.getAttribute('title');
                if (!title) return;
                
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                
                e.target.removeAttribute('title');
                e.target.dataset.originalTitle = title;
            });
            
            element.addEventListener('mouseleave', (e) => {
                const tooltip = document.querySelector('.custom-tooltip');
                if (tooltip) tooltip.remove();
                
                if (e.target.dataset.originalTitle) {
                    e.target.setAttribute('title', e.target.dataset.originalTitle);
                    delete e.target.dataset.originalTitle;
                }
            });
        });
        
        // Add tooltip styles
        if (!document.getElementById('custom-tooltip-styles')) {
            const styles = `
                <style>
                    .custom-tooltip {
                        position: fixed;
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        z-index: 1000;
                        pointer-events: none;
                        max-width: 200px;
                        text-align: center;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    initAnalytics() {
        // Initialize Google Analytics or other analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID');
        }
        
        // Track page views
        this.trackPageView();
        
        // Track custom events
        this.setupAnalyticsEvents();
    }
    
    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        };
        
        // Save to localStorage for analytics
        const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
        pageViews.push(pageData);
        localStorage.setItem('pageViews', JSON.stringify(pageViews.slice(-100))); // Keep last 100
    }
    
    setupAnalyticsEvents() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.trackEvent('form_submit', {
                form_id: form.id || form.className,
                form_action: form.action
            });
        });
        
        // Track job applications
        document.addEventListener('click', (e) => {
            if (e.target.closest('.apply-btn')) {
                const jobId = e.target.closest('.apply-btn').dataset.jobId;
                this.trackEvent('job_apply', { job_id: jobId });
            }
        });
        
        // Track job views
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const jobId = e.target.closest('.view-btn').dataset.jobId;
                this.trackEvent('job_view', { job_id: jobId });
            }
        });
    }
    
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            user: this.user ? this.user.id : 'anonymous'
        };
        
        // Save to localStorage
        const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
        events.push(event);
        localStorage.setItem('analyticsEvents', JSON.stringify(events.slice(-500))); // Keep last 500
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Event tracked:', event);
        }
    }
    
    // Show loading overlay
    showLoading(message = 'Loading...') {
        if (this.modules.ui) {
            this.modules.ui.showLoadingOverlay(message);
        } else {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }
    
    // Hide loading overlay
    hideLoading() {
        if (this.modules.ui) {
            this.modules.ui.hideLoadingOverlay();
        } else {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) overlay.remove();
        }
    }
    
    // Utility functions (delegated to utils module if available)
    formatDate(date, format = 'en-US') {
        if (this.modules.utils) {
            return this.modules.utils.formatDate(date, format);
        }
        
        // Fallback implementation
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(date).toLocaleDateString(format, options);
    }
    
    formatCurrency(amount, currency = 'ETB') {
        if (this.modules.utils) {
            return this.modules.utils.formatCurrency(amount, currency);
        }
        
        // Fallback implementation
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    validateEmail(email) {
        if (this.modules.utils) {
            return this.modules.utils.validateEmail(email);
        }
        
        // Fallback implementation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    debounce(func, wait) {
        if (this.modules.utils) {
            return this.modules.utils.debounce(func, wait);
        }
        
        // Fallback implementation
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
    
    throttle(func, limit) {
        if (this.modules.utils) {
            return this.modules.utils.throttle(func, limit);
        }
        
        // Fallback implementation
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Load preferences from localStorage
    loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            
            // Apply preferences
            if (preferences.notifications !== undefined) {
                this.notificationsEnabled = preferences.notifications;
            }
            
            if (preferences.emailUpdates !== undefined) {
                this.emailUpdatesEnabled = preferences.emailUpdates;
            }
            
            if (preferences.searchAlerts !== undefined) {
                this.searchAlertsEnabled = preferences.searchAlerts;
            }
            
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
    
    // Save preferences to localStorage
    savePreferences() {
        const preferences = {
            notifications: this.notificationsEnabled,
            emailUpdates: this.emailUpdatesEnabled,
            searchAlerts: this.searchAlertsEnabled
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jobPortal = new JobPortal();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobPortal;
}
