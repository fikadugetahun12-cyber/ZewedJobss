// Notification system for job portal

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.permission = Notification.permission;
        this.soundEnabled = localStorage.getItem('notificationSound') !== 'false';
        this.vibrationEnabled = localStorage.getItem('notificationVibration') !== 'false';
        this.init();
    }
    
    init() {
        this.loadNotifications();
        this.setupServiceWorker();
        this.setupEventListeners();
        
        // Request notification permission if not already granted
        if (this.permission === 'default') {
            this.requestPermission();
        }
    }
    
    async requestPermission() {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                this.permission = permission;
                localStorage.setItem('notificationPermission', permission);
                return permission;
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                return 'denied';
            }
        }
        return 'unsupported';
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    this.serviceWorkerRegistration = registration;
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }
    
    setupEventListeners() {
        // Listen for push notifications
        if ('BroadcastChannel' in window) {
            this.notificationChannel = new BroadcastChannel('notifications');
            this.notificationChannel.onmessage = (event) => {
                this.handlePushNotification(event.data);
            };
        }
        
        // Listen for visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.markAllAsRead();
            }
        });
        
        // Listen for custom events
        document.addEventListener('newNotification', (event) => {
            this.addNotification(event.detail);
        });
    }
    
    addNotification(notificationData) {
        const notification = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: notificationData.type || 'info',
            title: notificationData.title,
            message: notificationData.message,
            data: notificationData.data || {},
            timestamp: new Date(),
            read: false,
            priority: notificationData.priority || 'normal'
        };
        
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showNotification(notification);
        this.updateBadgeCount();
        
        return notification;
    }
    
    showNotification(notification) {
        // Show browser notification
        if (this.permission === 'granted' && document.visibilityState === 'hidden') {
            this.showBrowserNotification(notification);
        }
        
        // Show in-app notification
        this.showInAppNotification(notification);
        
        // Play sound if enabled
        if (this.soundEnabled) {
            this.playNotificationSound(notification.type);
        }
        
        // Vibrate if enabled and supported
        if (this.vibrationEnabled && 'vibrate' in navigator) {
            this.vibrateDevice(notification.priority);
        }
    }
    
    showBrowserNotification(notification) {
        const options = {
            body: notification.message,
            icon: '/assets/logos/logo-192.png',
            badge: '/assets/logos/logo-192.png',
            tag: notification.id,
            data: notification.data,
            requireInteraction: notification.priority === 'high',
            silent: !this.soundEnabled
        };
        
        if (notification.actions) {
            options.actions = notification.actions;
        }
        
        const browserNotification = new Notification(notification.title, options);
        
        browserNotification.onclick = () => {
            window.focus();
            browserNotification.close();
            this.handleNotificationClick(notification);
        };
        
        browserNotification.onclose = () => {
            this.markAsRead(notification.id);
        };
        
        // Auto-close after 10 seconds for normal priority
        if (notification.priority === 'normal') {
            setTimeout(() => browserNotification.close(), 10000);
        }
    }
    
    showInAppNotification(notification) {
        // Create notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification alert alert-${this.getAlertType(notification.type)} alert-dismissible fade show`;
        notificationEl.dataset.notificationId = notification.id;
        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-body">
                    <h6 class="notification-title mb-1">${notification.title}</h6>
                    <p class="notification-message mb-0">${notification.message}</p>
                    <small class="notification-time">${this.formatTime(notification.timestamp)}</small>
                </div>
                <button type="button" class="btn-close" data-notification-id="${notification.id}"></button>
            </div>
        `;
        
        // Add click handler
        notificationEl.addEventListener('click', (e) => {
            if (!e.target.matches('.btn-close')) {
                this.handleNotificationClick(notification);
            }
        });
        
        // Add to notification container
        const container = this.getNotificationContainer();
        container.insertBefore(notificationEl, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.remove();
            }
        }, 5000);
    }
    
    getNotificationContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1060';
            document.body.appendChild(container);
        }
        return container;
    }
    
    handleNotificationClick(notification) {
        this.markAsRead(notification.id);
        
        // Handle different notification types
        switch (notification.type) {
            case 'job_application':
                if (notification.data.jobId) {
                    window.location.href = `/jobs/${notification.data.jobId}`;
                }
                break;
                
            case 'payment':
                if (notification.data.paymentId) {
                    window.location.href = `/payment-success.html?transaction=${notification.data.paymentId}`;
                }
                break;
                
            case 'message':
                if (notification.data.chatId) {
                    window.location.href = `/chat.html?id=${notification.data.chatId}`;
                }
                break;
                
            case 'course':
                if (notification.data.courseId) {
                    window.location.href = `/courses/${notification.data.courseId}`;
                }
                break;
        }
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('notificationClicked', {
            detail: { notification }
        }));
    }
    
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateBadgeCount();
            
            // Remove from UI if present
            const notificationEl = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationEl) {
                notificationEl.remove();
            }
        }
    }
    
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateBadgeCount();
        
        // Remove all in-app notifications
        document.querySelectorAll('.notification').forEach(el => el.remove());
    }
    
    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateBadgeCount();
    }
    
    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.updateBadgeCount();
        
        // Remove all in-app notifications
        document.querySelectorAll('.notification').forEach(el => el.remove());
    }
    
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }
    
    updateBadgeCount() {
        const count = this.getUnreadCount();
        
        // Update badge in UI
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count.toString();
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        });
        
        // Update browser tab title
        if (count > 0) {
            document.title = `(${count}) ${document.title.replace(/^\(\d+\)\s*/, '')}`;
        } else {
            document.title = document.title.replace(/^\(\d+\)\s*/, '');
        }
        
        // Update app badge if supported
        if ('setAppBadge' in navigator) {
            navigator.setAppBadge(count);
        }
    }
    
    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            try {
                this.notifications = JSON.parse(saved);
                // Convert string dates back to Date objects
                this.notifications.forEach(notification => {
                    notification.timestamp = new Date(notification.timestamp);
                });
            } catch (error) {
                console.error('Error loading notifications:', error);
                this.notifications = [];
            }
        }
    }
    
    saveNotifications() {
        // Keep only last 100 notifications
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }
        
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
    
    playNotificationSound(type) {
        const audio = new Audio();
        
        switch (type) {
            case 'success':
                audio.src = '/assets/sounds/success.mp3';
                break;
            case 'warning':
                audio.src = '/assets/sounds/warning.mp3';
                break;
            case 'error':
                audio.src = '/assets/sounds/error.mp3';
                break;
            default:
                audio.src = '/assets/sounds/notification.mp3';
        }
        
        audio.volume = 0.3;
        audio.play().catch(error => {
            console.warn('Could not play notification sound:', error);
        });
    }
    
    vibrateDevice(priority) {
        let pattern;
        
        switch (priority) {
            case 'high':
                pattern = [200, 100, 200];
                break;
            case 'urgent':
                pattern = [300, 100, 300, 100, 300];
                break;
            default:
                pattern = [200];
        }
        
        navigator.vibrate(pattern);
    }
    
    getAlertType(notificationType) {
        switch (notificationType) {
            case 'success':
            case 'payment':
            case 'job_application':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'danger';
            default:
                return 'info';
        }
    }
    
    getNotificationIcon(notificationType) {
        switch (notificationType) {
            case 'job_application':
                return 'briefcase';
            case 'payment':
                return 'credit-card';
            case 'message':
                return 'envelope';
            case 'course':
                return 'graduation-cap';
            case 'success':
                return 'check-circle';
            case 'warning':
                return 'exclamation-triangle';
            case 'error':
                return 'times-circle';
            default:
                return 'info-circle';
        }
    }
    
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Push notification subscription
    async subscribeToPushNotifications() {
        if (!this.serviceWorkerRegistration) {
            console.warn('Service Worker not registered');
            return null;
        }
        
        try {
            const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
            });
            
            // Send subscription to server
            await api.post('/notifications/subscribe', { subscription });
            
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    }
    
    handlePushNotification(pushData) {
        this.addNotification({
            type: pushData.type,
            title: pushData.title,
            message: pushData.body,
            data: pushData.data,
            priority: pushData.priority || 'normal'
        });
    }
    
    // Settings
    enableSound(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('notificationSound', enabled);
    }
    
    enableVibration(enabled) {
        this.vibrationEnabled = enabled;
        localStorage.setItem('notificationVibration', enabled);
    }
}

// Create singleton instance
const notificationSystem = new NotificationSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = notificationSystem;
} else {
    window.notificationSystem = notificationSystem;
}
