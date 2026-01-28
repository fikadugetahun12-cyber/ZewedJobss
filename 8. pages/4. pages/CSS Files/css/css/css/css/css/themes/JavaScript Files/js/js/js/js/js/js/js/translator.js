// Multi-language translation system

class Translator {
    constructor() {
        this.languages = {
            'en': 'English',
            'am': 'አማርኛ',
            'om': 'Afaan Oromoo',
            'ti': 'ትግርኛ',
            'so': 'Soomaali'
        };
        
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.loadTranslations();
    }
    
    async loadTranslations() {
        try {
            // Load translations from JSON files or API
            const response = await fetch(`/translations/${this.currentLang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.warn('Failed to load translations, using fallback:', error);
            this.translations = this.getFallbackTranslations();
        }
        
        this.applyTranslations();
    }
    
    getFallbackTranslations() {
        return {
            // Navigation
            'nav.home': 'Home',
            'nav.jobs': 'Jobs',
            'nav.employers': 'For Employers',
            'nav.courses': 'Courses',
            'nav.news': 'News',
            'nav.events': 'Events',
            'nav.media': 'Media Room',
            'nav.ai_chat': 'AI Assistant',
            'nav.premium': 'Premium',
            'nav.sign_in': 'Sign In',
            'nav.sign_up': 'Sign Up',
            'nav.profile': 'My Profile',
            'nav.settings': 'Settings',
            'nav.logout': 'Logout',
            
            // Hero Section
            'hero.title': 'Find Your Dream Job Today',
            'hero.subtitle': 'Connect with top employers, enhance your skills with our courses, and advance your career.',
            'hero.browse_jobs': 'Browse Jobs',
            'hero.view_courses': 'View Courses',
            
            // Features
            'features.job_matching': 'Job Matching',
            'features.job_matching_desc': 'AI-powered job matching based on your skills and preferences.',
            'features.skill_training': 'Skill Training',
            'features.skill_training_desc': 'Access premium courses to enhance your career prospects.',
            'features.ai_assistant': 'AI Assistant',
            'features.ai_assistant_desc': 'Get career guidance from our intelligent AI chatbot.',
            
            // Common
            'common.loading': 'Loading...',
            'common.error': 'An error occurred',
            'common.success': 'Success!',
            'common.submit': 'Submit',
            'common.cancel': 'Cancel',
            'common.save': 'Save',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.view': 'View',
            'common.more': 'More',
            'common.less': 'Less',
            'common.search': 'Search',
            'common.filter': 'Filter',
            'common.sort': 'Sort',
            'common.apply': 'Apply',
            'common.clear': 'Clear',
            
            // Auth
            'auth.login': 'Login',
            'auth.register': 'Register',
            'auth.email': 'Email Address',
            'auth.password': 'Password',
            'auth.confirm_password': 'Confirm Password',
            'auth.forgot_password': 'Forgot Password?',
            'auth.remember_me': 'Remember Me',
            'auth.no_account': 'Don\'t have an account?',
            'auth.have_account': 'Already have an account?',
            
            // Jobs
            'jobs.title': 'Available Jobs',
            'jobs.search_placeholder': 'Search jobs by title, company, or keyword',
            'jobs.filter_location': 'Location',
            'jobs.filter_type': 'Job Type',
            'jobs.filter_salary': 'Salary Range',
            'jobs.filter_experience': 'Experience Level',
            'jobs.apply': 'Apply Now',
            'jobs.save': 'Save Job',
            'jobs.share': 'Share',
            'jobs.description': 'Job Description',
            'jobs.requirements': 'Requirements',
            'jobs.benefits': 'Benefits',
            'jobs.deadline': 'Application Deadline',
            'jobs.posted': 'Posted',
            'jobs.views': 'Views',
            'jobs.applicants': 'Applicants',
            
            // Payments
            'payment.title': 'Upgrade to Premium',
            'payment.select_method': 'Select Payment Method',
            'payment.proceed': 'Proceed to Payment',
            'payment.success': 'Payment Successful!',
            'payment.failed': 'Payment Failed',
            'payment.retry': 'Try Again',
            'payment.amount': 'Amount',
            'payment.transaction_id': 'Transaction ID',
            'payment.date': 'Date',
            'payment.status': 'Status',
            
            // AI Chat
            'ai_chat.title': 'AI Career Assistant',
            'ai_chat.placeholder': 'Type your question here...',
            'ai_chat.suggestions': 'Try asking:',
            'ai_chat.suggestion1': 'Resume tips',
            'ai_chat.suggestion2': 'In-demand skills',
            'ai_chat.suggestion3': 'Interview prep',
            'ai_chat.typing': 'AI Assistant is typing...',
            
            // Footer
            'footer.company': 'Company',
            'footer.about': 'About Us',
            'footer.contact': 'Contact',
            'footer.support': 'Support',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service',
            'footer.cookies': 'Cookie Policy',
            'footer.copyright': 'All rights reserved',
            'footer.language': 'Language',
            
            // Ethiopian Calendar
            'calendar.ethiopian': 'Ethiopian Date',
            'calendar.gregorian': 'Gregorian Date',
            'calendar.holidays': 'Holidays',
            
            // Error Messages
            'error.required': 'This field is required',
            'error.email': 'Please enter a valid email',
            'error.password_length': 'Password must be at least 8 characters',
            'error.password_match': 'Passwords do not match',
            'error.network': 'Network error. Please check your connection',
            'error.server': 'Server error. Please try again later',
            'error.unauthorized': 'Unauthorized access',
            'error.not_found': 'Resource not found',
            'error.timeout': 'Request timeout',
            
            // Success Messages
            'success.profile_updated': 'Profile updated successfully',
            'success.job_applied': 'Job application submitted',
            'success.payment_complete': 'Payment completed successfully',
            'success.course_enrolled': 'Course enrollment successful',
            'success.message_sent': 'Message sent successfully'
        };
    }
    
    applyTranslations() {
        // Find all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update page title if specified
        const pageTitleKey = document.querySelector('title')?.getAttribute('data-i18n');
        if (pageTitleKey) {
            const translatedTitle = this.translate(pageTitleKey);
            if (translatedTitle) {
                document.title = translatedTitle;
            }
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }
    
    translate(key, params = {}) {
        let translation = this.translations[key] || key;
        
        // Replace parameters in translation
        Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(`{{${param}}}`, value);
        });
        
        return translation;
    }
    
    translateElement(element, key, params = {}) {
        const translation = this.translate(key, params);
        element.textContent = translation;
    }
    
    translateInput(element, key, params = {}) {
        const translation = this.translate(key, params);
        element.placeholder = translation;
    }
    
    async switchLanguage(langCode) {
        if (this.languages[langCode] && langCode !== this.currentLang) {
            this.currentLang = langCode;
            localStorage.setItem('language', langCode);
            
            // Save language preference to server if user is logged in
            if (localStorage.getItem('authToken')) {
                try {
                    await api.patch('/profile/language', { language: langCode });
                } catch (error) {
                    console.warn('Failed to save language preference:', error);
                }
            }
            
            // Reload translations
            await this.loadTranslations();
            
            // Update language switcher UI
            this.updateLanguageSwitcher(langCode);
            
            return true;
        }
        return false;
    }
    
    updateLanguageSwitcher(selectedLang) {
        document.querySelectorAll('.language-switcher .dropdown-item').forEach(item => {
            const lang = item.dataset.lang;
            if (lang === selectedLang) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    getCurrentLanguage() {
        return {
            code: this.currentLang,
            name: this.languages[this.currentLang] || 'English'
        };
    }
    
    getAvailableLanguages() {
        return Object.entries(this.languages).map(([code, name]) => ({
            code,
            name
        }));
    }
    
    // Ethiopian calendar integration
    getEthiopianDate(date = new Date()) {
        // Convert Gregorian date to Ethiopian date
        // This is a simplified conversion - in production use a proper library
        const gregorianYear = date.getFullYear();
        const gregorianMonth = date.getMonth() + 1;
        const gregorianDay = date.getDate();
        
        // Simple conversion algorithm (approximate)
        let ethiopianYear = gregorianYear - 8;
        let ethiopianMonth = gregorianMonth - 9;
        let ethiopianDay = gregorianDay - 11;
        
        if (ethiopianMonth <= 0) {
            ethiopianYear--;
            ethiopianMonth += 12;
        }
        
        if (ethiopianDay <= 0) {
            ethiopianMonth--;
            ethiopianDay += 30;
        }
        
        // Ethiopian month names
        const ethiopianMonths = [
            'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
        ];
        
        return {
            day: ethiopianDay,
            month: ethiopianMonths[ethiopianMonth - 1],
            year: ethiopianYear,
            fullDate: `${ethiopianDay} ${ethiopianMonths[ethiopianMonth - 1]} ${ethiopianYear}`
        };
    }
    
    formatCurrency(amount, currency = 'ETB') {
        const formatters = {
            'en': new Intl.NumberFormat('en-ET', {
                style: 'currency',
                currency: currency
            }),
            'am': new Intl.NumberFormat('am-ET', {
                style: 'currency',
                currency: currency
            })
        };
        
        const formatter = formatters[this.currentLang] || formatters.en;
        return formatter.format(amount);
    }
    
    formatDate(date, options = {}) {
        const dateObj = new Date(date);
        const locales = {
            'en': 'en-US',
            'am': 'am-ET',
            'om': 'om-ET',
            'ti': 'ti-ET',
            'so': 'so-SO'
        };
        
        const locale = locales[this.currentLang] || 'en-US';
        
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
    }
}

// Create singleton instance
const translator = new Translator();

// Initialize translator on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add language switcher to page if not present
    if (!document.querySelector('.language-switcher')) {
        const languages = translator.getAvailableLanguages();
        const currentLang = translator.getCurrentLanguage();
        
        const switcherHTML = `
            <div class="dropdown language-switcher">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-globe me-1"></i> ${currentLang.name}
                </button>
                <ul class="dropdown-menu">
                    ${languages.map(lang => `
                        <li>
                            <a class="dropdown-item ${lang.code === currentLang.code ? 'active' : ''}" 
                               href="#" data-lang="${lang.code}">
                                ${lang.name}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // Add to appropriate location in the page
        const target = document.querySelector('.language-switcher-container') || 
                      document.querySelector('footer') || 
                      document.body;
        
        if (target) {
            const container = document.createElement('div');
            container.innerHTML = switcherHTML;
            target.appendChild(container.firstElementChild);
            
            // Add event listeners
            container.querySelectorAll('[data-lang]').forEach(link => {
                link.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const langCode = link.dataset.lang;
                    await translator.switchLanguage(langCode);
                });
            });
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translator;
} else {
    window.translator = translator;
}
