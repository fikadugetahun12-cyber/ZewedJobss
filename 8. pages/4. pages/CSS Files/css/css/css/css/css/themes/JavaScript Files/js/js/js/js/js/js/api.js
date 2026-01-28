// API Service for handling all HTTP requests

const API_CONFIG = {
    BASE_URL: 'https://api.jobportal.et/v1',
    TIMEOUT: 30000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000
};

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        this.setAuthToken();
    }
    
    setAuthToken() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: { ...this.headers, ...options.headers }
        };
        
        let retries = API_CONFIG.RETRY_COUNT;
        
        while (retries > 0) {
            try {
                const response = await this.timeoutFetch(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                return { success: true, data };
                
            } catch (error) {
                retries--;
                
                if (retries === 0) {
                    return { 
                        success: false, 
                        error: error.message,
                        status: error.status
                    };
                }
                
                // Wait before retry
                await this.delay(API_CONFIG.RETRY_DELAY);
            }
        }
    }
    
    async timeoutFetch(url, config) {
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT)
        );
        
        const fetchPromise = fetch(url, config);
        return Promise.race([fetchPromise, timeout]);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }
    
    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // PATCH request
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
    
    // File upload
    async upload(endpoint, file, fieldName = 'file') {
        const formData = new FormData();
        formData.append(fieldName, file);
        
        return this.request(endpoint, {
            method: 'POST',
            headers: {},
            body: formData
        });
    }
    
    // Authentication methods
    async login(email, password) {
        const response = await this.post('/auth/login', { email, password });
        
        if (response.success) {
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.setAuthToken();
        }
        
        return response;
    }
    
    async logout() {
        await this.post('/auth/logout');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete this.headers['Authorization'];
    }
    
    async register(userData) {
        return this.post('/auth/register', userData);
    }
    
    async refreshToken() {
        const response = await this.post('/auth/refresh');
        if (response.success) {
            localStorage.setItem('authToken', response.data.token);
            this.setAuthToken();
        }
        return response;
    }
    
    // Job related methods
    async getJobs(filters = {}) {
        return this.get('/jobs', filters);
    }
    
    async getJobById(id) {
        return this.get(`/jobs/${id}`);
    }
    
    async applyForJob(jobId, applicationData) {
        return this.post(`/jobs/${jobId}/apply`, applicationData);
    }
    
    async saveJob(jobId) {
        return this.post(`/jobs/${jobId}/save`);
    }
    
    // User profile methods
    async getProfile() {
        return this.get('/profile');
    }
    
    async updateProfile(profileData) {
        return this.put('/profile', profileData);
    }
    
    async uploadResume(file) {
        return this.upload('/profile/resume', file);
    }
    
    // Payment methods
    async initiatePayment(paymentData) {
        return this.post('/payments/initiate', paymentData);
    }
    
    async verifyPayment(transactionId) {
        return this.get(`/payments/verify/${transactionId}`);
    }
    
    async getPaymentHistory() {
        return this.get('/payments/history');
    }
    
    // AI Chat methods
    async sendChatMessage(message, context = {}) {
        return this.post('/ai/chat', { message, context });
    }
    
    async getCareerSuggestions() {
        return this.get('/ai/suggestions');
    }
    
    // Course methods
    async getCourses(filters = {}) {
        return this.get('/courses', filters);
    }
    
    async enrollCourse(courseId) {
        return this.post(`/courses/${courseId}/enroll`);
    }
    
    // Analytics
    async getAnalytics(period = 'month') {
        return this.get(`/analytics/${period}`);
    }
    
    // Error handling wrapper
    async withErrorHandling(apiCall) {
        try {
            return await apiCall();
        } catch (error) {
            console.error('API Error:', error);
            
            // Handle different error types
            if (error.message.includes('timeout')) {
                throw new Error('Request timeout. Please check your connection.');
            } else if (error.message.includes('401')) {
                // Token expired, try to refresh
                const refreshResponse = await this.refreshToken();
                if (refreshResponse.success) {
                    return await apiCall(); // Retry original call
                } else {
                    throw new Error('Session expired. Please login again.');
                }
            } else if (error.message.includes('403')) {
                throw new Error('Access denied. You do not have permission.');
            } else if (error.message.includes('404')) {
                throw new Error('Resource not found.');
            } else if (error.message.includes('500')) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('An error occurred. Please try again.');
            }
        }
    }
    
    // Rate limiting helper
    createRateLimitedRequest(limit = 5, interval = 60000) {
        let queue = [];
        let requestsInInterval = 0;
        let intervalStart = Date.now();
        
        return async (endpoint, options) => {
            const now = Date.now();
            
            // Reset counter if interval has passed
            if (now - intervalStart > interval) {
                requestsInInterval = 0;
                intervalStart = now;
            }
            
            // If rate limit reached, wait
            if (requestsInInterval >= limit) {
                const waitTime = interval - (now - intervalStart);
                await this.delay(waitTime);
                return this.createRateLimitedRequest(endpoint, options);
            }
            
            requestsInInterval++;
            return this.request(endpoint, options);
        };
    }
}

// Create singleton instance
const api = new ApiService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
} else {
    window.api = api;
}
