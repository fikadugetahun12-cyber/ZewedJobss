/**
 * Jobs Module - Job listing and application management
 */

class JobsManager {
    constructor() {
        this.jobs = [];
        this.filters = {
            keyword: '',
            location: '',
            category: '',
            salaryRange: [0, 1000000],
            experience: '',
            type: ''
        };
        this.applications = [];
        this.bookmarks = [];
        this.loadFromStorage();
    }
    
    // Initialize jobs data
    async loadJobs() {
        try {
            // In a real app, this would be an API call
            // For now, we'll use mock data
            this.jobs = await this.getMockJobs();
            this.renderJobListings();
            return this.jobs;
        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showError('Failed to load jobs. Please try again.');
            return [];
        }
    }
    
    // Get mock job data
    async getMockJobs() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'Senior Software Engineer',
                        company: 'Tech Solutions PLC',
                        location: 'Addis Ababa',
                        salary: 'Competitive',
                        type: 'Full-time',
                        experience: '5+ years',
                        category: 'Technology',
                        description: 'We are looking for an experienced software engineer to join our growing team and work on exciting projects.',
                        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
                        postedDate: '2024-01-15',
                        deadline: '2024-02-15',
                        isFeatured: true,
                        isRemote: false,
                        companyLogo: 'https://via.placeholder.com/50',
                        applicationCount: 42
                    },
                    {
                        id: 2,
                        title: 'Financial Analyst',
                        company: 'Global Finance Group',
                        location: 'Remote',
                        salary: '25,000 ETB+',
                        type: 'Full-time',
                        experience: '3+ years',
                        category: 'Finance',
                        description: 'Seeking a detail-oriented financial analyst to provide insights and support strategic decision-making.',
                        skills: ['Excel', 'Financial Analysis', 'Reporting', 'SQL'],
                        postedDate: '2024-01-10',
                        deadline: '2024-01-31',
                        isFeatured: true,
                        isRemote: true,
                        companyLogo: 'https://via.placeholder.com/50',
                        applicationCount: 28
                    },
                    {
                        id: 3,
                        title: 'Marketing Manager',
                        company: 'Growth Marketing Inc.',
                        location: 'Addis Ababa',
                        salary: '30,000-40,000 ETB',
                        type: 'Full-time',
                        experience: '4+ years',
                        category: 'Marketing',
                        description: 'Lead our marketing efforts and develop strategies to increase brand awareness and customer acquisition.',
                        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy'],
                        postedDate: '2024-01-12',
                        deadline: '2024-02-10',
                        isFeatured: false,
                        isRemote: false,
                        companyLogo: 'https://via.placeholder.com/50',
                        applicationCount: 35
                    },
                    {
                        id: 4,
                        title: 'Medical Doctor',
                        company: 'HealthFirst Hospital',
                        location: 'Addis Ababa',
                        salary: 'Negotiable',
                        type: 'Full-time',
                        experience: '3+ years',
                        category: 'Healthcare',
                        description: 'Licensed medical doctor needed for our expanding healthcare facility.',
                        skills: ['Medicine', 'Patient Care', 'Diagnosis', 'Treatment'],
                        postedDate: '2024-01-08',
                        deadline: '2024-01-25',
                        isFeatured: true,
                        isRemote: false,
                        companyLogo: 'https://via.placeholder.com/50',
                        applicationCount: 19
                    },
                    {
                        id: 5,
                        title: 'Graphic Designer',
                        company: 'Creative Studio',
                        location: 'Remote',
                        salary: '15,000-20,000 ETB',
                        type: 'Part-time',
                        experience: '2+ years',
                        category: 'Design',
                        description: 'Create stunning visual designs for various digital and print media.',
                        skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX'],
                        postedDate: '2024-01-14',
                        deadline: '2024-02-05',
                        isFeatured: false,
                        isRemote: true,
                        companyLogo: 'https://via.placeholder.com/50',
                        applicationCount: 47
                    }
                ]);
            }, 500);
        });
    }
    
    // Render job listings
    renderJobListings(jobs = null) {
        const container = document.querySelector('#jobs-container') || 
                         document.querySelector('.grid.grid-3') ||
                         document.querySelector('.jobs-list');
        
        if (!container) return;
        
        const jobsToRender = jobs || this.getFilteredJobs();
        
        container.innerHTML = jobsToRender.map((job, index) => `
            <div class="card slide-up" style="animation-delay: ${index * 0.1}s;">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            ${job.isFeatured ? '<span class="badge badge-accent me-1">Featured</span>' : ''}
                            ${job.isRemote ? '<span class="badge badge-primary me-1">Remote</span>' : ''}
                            <span class="badge badge-primary">${job.type}</span>
                        </div>
                        <small>${this.formatDate(job.postedDate)}</small>
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="feature-icon" style="width: 50px; height: 50px; font-size: 1.2rem;">
                            <i class="fas fa-${this.getCategoryIcon(job.category)}"></i>
                        </div>
                        <div class="ms-3">
                            <h4 class="feature-title mb-1">${job.title}</h4>
                            <p class="text-light mb-0">
                                <i class="fas fa-building"></i> ${job.company}
                                <span class="ms-2"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            </p>
                        </div>
                    </div>
                    <p class="mb-3">${job.description.substring(0, 120)}...</p>
                    <div class="mb-3">
                        ${job.skills.slice(0, 3).map(skill => 
                            `<span class="badge badge-primary me-1">${skill}</span>`
                        ).join('')}
                        ${job.skills.length > 3 ? 
                            `<span class="badge badge-primary">+${job.skills.length - 3}</span>` : ''
                        }
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary">
                            <i class="fas fa-money-bill-wave"></i> ${job.salary}
                        </span>
                        <span class="text-light">
                            <i class="fas fa-users"></i> ${job.applicationCount} applicants
                        </span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline bookmark-btn" data-job-id="${job.id}" 
                                title="${this.isBookmarked(job.id) ? 'Remove bookmark' : 'Bookmark job'}">
                            <i class="fas ${this.isBookmarked(job.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                        </button>
                        <button class="btn btn-primary apply-btn" data-job-id="${job.id}"
                                ${this.hasApplied(job.id) ? 'disabled' : ''}>
                            <i class="fas ${this.hasApplied(job.id) ? 'fa-check' : 'fa-paper-plane'}"></i>
                            ${this.hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                        </button>
                        <button class="btn btn-outline view-btn" data-job-id="${job.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Attach event listeners
        this.attachJobEventListeners();
    }
    
    // Get filtered jobs based on current filters
    getFilteredJobs() {
        return this.jobs.filter(job => {
            const matchesKeyword = !this.filters.keyword || 
                job.title.toLowerCase().includes(this.filters.keyword.toLowerCase()) ||
                job.company.toLowerCase().includes(this.filters.keyword.toLowerCase()) ||
                job.description.toLowerCase().includes(this.filters.keyword.toLowerCase());
            
            const matchesLocation = !this.filters.location || 
                job.location.toLowerCase().includes(this.filters.location.toLowerCase());
            
            const matchesCategory = !this.filters.category || 
                job.category === this.filters.category;
            
            return matchesKeyword && matchesLocation && matchesCategory;
        });
    }
    
    // Apply filters
    applyFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.renderJobListings();
        this.saveFilters();
    }
    
    // Apply for a job
    async applyForJob(jobId, applicationData = {}) {
        const job = this.jobs.find(j => j.id === parseInt(jobId));
        if (!job) {
            throw new Error('Job not found');
        }
        
        if (this.hasApplied(jobId)) {
            throw new Error('You have already applied for this job');
        }
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const application = {
                    jobId,
                    jobTitle: job.title,
                    company: job.company,
                    appliedDate: new Date().toISOString(),
                    status: 'pending',
                    ...applicationData
                };
                
                this.applications.push(application);
                this.saveToStorage();
                
                // Increment application count
                job.applicationCount++;
                
                resolve(application);
            }, 1000);
        });
    }
    
    // Bookmark a job
    toggleBookmark(jobId) {
        const index = this.bookmarks.indexOf(jobId);
        if (index === -1) {
            this.bookmarks.push(jobId);
        } else {
            this.bookmarks.splice(index, 1);
        }
        this.saveToStorage();
    }
    
    // Check if job is bookmarked
    isBookmarked(jobId) {
        return this.bookmarks.includes(parseInt(jobId));
    }
    
    // Check if user has applied for a job
    hasApplied(jobId) {
        return this.applications.some(app => app.jobId === parseInt(jobId));
    }
    
    // Get user's applications
    getUserApplications() {
        return this.applications;
    }
    
    // Get bookmarked jobs
    getBookmarkedJobs() {
        return this.jobs.filter(job => this.bookmarks.includes(job.id));
    }
    
    // View job details
    viewJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === parseInt(jobId));
        if (!job) return null;
        
        // Create and show job details modal
        this.showJobDetailsModal(job);
        return job;
    }
    
    // Show job details modal
    showJobDetailsModal(job) {
        const modalHTML = `
            <div class="modal" id="jobDetailsModal" style="display: block;">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">${job.title}</h3>
                            <button class="btn btn-small close-modal">&times;</button>
                        </div>
                        <div class="card-body">
                            <div class="mb-4">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="feature-icon me-3">
                                        <i class="fas fa-${this.getCategoryIcon(job.category)}"></i>
                                    </div>
                                    <div>
                                        <h4 class="mb-1">${job.company}</h4>
                                        <p class="text-light mb-0">
                                            <i class="fas fa-map-marker-alt"></i> ${job.location}
                                            <span class="ms-3"><i class="fas fa-clock"></i> ${job.type}</span>
                                            <span class="ms-3"><i class="fas fa-briefcase"></i> ${job.experience}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h5 class="text-primary">Salary</h5>
                                    <p><i class="fas fa-money-bill-wave"></i> ${job.salary}</p>
                                </div>
                                <div class="col-md-6">
                                    <h5 class="text-primary">Deadline</h5>
                                    <p><i class="fas fa-calendar"></i> ${this.formatDate(job.deadline)}</p>
                                </div>
                            </div>
                            
                            <h5 class="text-primary">Job Description</h5>
                            <p class="mb-4">${job.description}</p>
                            
                            <h5 class="text-primary">Required Skills</h5>
                            <div class="mb-4">
                                ${job.skills.map(skill => 
                                    `<span class="badge badge-primary me-1 mb-1">${skill}</span>`
                                ).join('')}
                            </div>
                            
                            <h5 class="text-primary">Application Details</h5>
                            <p class="text-light">
                                <i class="fas fa-users"></i> ${job.applicationCount} people have applied
                            </p>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-outline bookmark-btn" data-job-id="${job.id}">
                                    <i class="fas ${this.isBookmarked(job.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                                    ${this.isBookmarked(job.id) ? 'Bookmarked' : 'Bookmark'}
                                </button>
                                <button class="btn btn-primary apply-btn" data-job-id="${job.id}"
                                        ${this.hasApplied(job.id) ? 'disabled' : ''}>
                                    <i class="fas ${this.hasApplied(job.id) ? 'fa-check' : 'fa-paper-plane'}"></i>
                                    ${this.hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('jobDetailsModal');
        if (existingModal) existingModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles if not present
        this.addModalStyles();
        
        // Attach event listeners
        this.attachModalEventListeners();
    }
    
    // Add modal styles
    addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const styles = `
                <style>
                    .modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.7);
                        z-index: 1000;
                        overflow-y: auto;
                        padding: 20px;
                    }
                    .modal-content {
                        background: white;
                        margin: 50px auto;
                        border-radius: 8px;
                        animation: slideUp 0.3s ease;
                    }
                    .close-modal {
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--color-text);
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    // Attach modal event listeners
    attachModalEventListeners() {
        // Close modal button
        const closeBtn = document.querySelector('#jobDetailsModal .close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('jobDetailsModal').remove();
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('jobDetailsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
        
        // Attach bookmark and apply button listeners within modal
        this.attachJobEventListeners();
    }
    
    // Attach job event listeners
    attachJobEventListeners() {
        // Bookmark buttons
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobId = btn.dataset.jobId;
                this.toggleBookmark(jobId);
                
                // Update button icon
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = this.isBookmarked(jobId) ? 
                        'fas fa-bookmark' : 'fas fa-bookmark-o';
                }
                
                // Update button text if exists
                const text = btn.querySelector('span');
                if (text) {
                    text.textContent = this.isBookmarked(jobId) ? 'Bookmarked' : 'Bookmark';
                }
            });
        });
        
        // Apply buttons
        document.querySelectorAll('.apply-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const jobId = btn.dataset.jobId;
                
                // Show confirmation modal or apply directly
                const confirmed = await this.showApplyConfirmation(jobId);
                if (confirmed) {
                    await this.processApplication(jobId, btn);
                }
            });
        });
        
        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobId = btn.dataset.jobId;
                this.viewJobDetails(jobId);
            });
        });
    }
    
    // Show apply confirmation
    async showApplyConfirmation(jobId) {
        return new Promise((resolve) => {
            // Create confirmation modal
            const modalHTML = `
                <div class="modal" id="applyConfirmationModal">
                    <div class="card" style="max-width: 500px; margin: 100px auto;">
                        <div class="card-header">
                            <h4>Confirm Application</h4>
                        </div>
                        <div class="card-body">
                            <p>Are you sure you want to apply for this job?</p>
                            <p class="text-light">Make sure your profile is complete before applying.</p>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button class="btn btn-outline me-2 cancel-btn">Cancel</button>
                            <button class="btn btn-primary confirm-btn">Yes, Apply</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove existing modal if any
            const existing = document.getElementById('applyConfirmationModal');
            if (existing) existing.remove();
            
            // Add modal
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Add event listeners
            document.querySelector('#applyConfirmationModal .cancel-btn').addEventListener('click', () => {
                document.getElementById('applyConfirmationModal').remove();
                resolve(false);
            });
            
            document.querySelector('#applyConfirmationModal .confirm-btn').addEventListener('click', () => {
                document.getElementById('applyConfirmationModal').remove();
                resolve(true);
            });
            
            // Close on outside click
            document.getElementById('applyConfirmationModal').addEventListener('click', (e) => {
                if (e.target.id === 'applyConfirmationModal') {
                    document.getElementById('applyConfirmationModal').remove();
                    resolve(false);
                }
            });
        });
    }
    
    // Process application
    async processApplication(jobId, button) {
        const originalText = button.innerHTML;
        
        try {
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
            button.disabled = true;
            
            // Submit application
            const application = await this.applyForJob(jobId, {
                userId: window.jobPortal?.user?.id || 'guest',
                userEmail: window.jobPortal?.user?.email || '',
                cv: 'default.pdf',
                coverLetter: ''
            });
            
            // Update button state
            button.innerHTML = '<i class="fas fa-check"></i> Applied';
            button.classList.remove('btn-primary');
            button.classList.add('btn-accent');
            
            // Show success message
            if (window.jobPortal) {
                window.jobPortal.showNotification(
                    'Application Submitted!',
                    `Your application for "${application.jobTitle}" has been submitted successfully.`,
                    'success'
                );
            }
            
        } catch (error) {
            console.error('Application error:', error);
            
            // Restore button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Show error
            if (window.jobPortal) {
                window.jobPortal.showNotification(
                    'Application Failed',
                    error.message || 'Failed to submit application. Please try again.',
                    'error'
                );
            }
        }
    }
    
    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('jobApplications', JSON.stringify(this.applications));
        localStorage.setItem('jobBookmarks', JSON.stringify(this.bookmarks));
        localStorage.setItem('jobFilters', JSON.stringify(this.filters));
    }
    
    // Load from localStorage
    loadFromStorage() {
        try {
            this.applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
            this.bookmarks = JSON.parse(localStorage.getItem('jobBookmarks')) || [];
            this.filters = JSON.parse(localStorage.getItem('jobFilters')) || this.filters;
        } catch (error) {
            console.error('Error loading job data from storage:', error);
        }
    }
    
    // Save filters
    saveFilters() {
        localStorage.setItem('jobFilters', JSON.stringify(this.filters));
    }
    
    // Utility methods
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    getCategoryIcon(category) {
        const icons = {
            'Technology': 'code',
            'Finance': 'chart-line',
            'Healthcare': 'user-md',
            'Marketing': 'bullhorn',
            'Design': 'palette',
            'Education': 'graduation-cap',
            'Engineering': 'cogs',
            'Sales': 'handshake',
            'Administration': 'file-alt',
            'Other': 'briefcase'
        };
        return icons[category] || 'briefcase';
    }
    
    showError(message) {
        if (window.jobPortal) {
            window.jobPortal.showNotification('Error', message, 'error');
        } else {
            alert(`Error: ${message}`);
        }
    }
}

// Export for global use
window.JobsManager = JobsManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.jobPortal) {
        window.jobPortal.jobsManager = new JobsManager();
        window.jobPortal.jobsManager.loadJobs();
    }
});
