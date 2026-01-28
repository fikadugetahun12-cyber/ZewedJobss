// Payment system for handling all payment operations

class PaymentSystem {
    constructor() {
        this.paymentMethods = {
            telebirr: {
                id: 'telebirr',
                name: 'Telebirr',
                icon: '/assets/logos/telebirr.png',
                type: 'mobile_money',
                country: 'ET',
                currency: 'ETB',
                minAmount: 1,
                maxAmount: 50000,
                fees: { percentage: 0.5, fixed: 0 }
            },
            cbe: {
                id: 'cbe',
                name: 'CBE Birr',
                icon: '/assets/logos/cbe.png',
                type: 'mobile_money',
                country: 'ET',
                currency: 'ETB',
                minAmount: 1,
                maxAmount: 100000,
                fees: { percentage: 0.75, fixed: 0 }
            },
            amole: {
                id: 'amole',
                name: 'Amole',
                icon: '/assets/icons/mobile-money.svg',
                type: 'mobile_money',
                country: 'ET',
                currency: 'ETB',
                minAmount: 1,
                maxAmount: 25000,
                fees: { percentage: 1, fixed: 0 }
            },
            visa: {
                id: 'visa',
                name: 'Visa/MasterCard',
                icon: '/assets/logos/visa-mastercard.png',
                type: 'card',
                country: 'INT',
                currency: 'USD',
                minAmount: 1,
                maxAmount: 10000,
                fees: { percentage: 2.5, fixed: 0.3 }
            },
            paypal: {
                id: 'paypal',
                name: 'PayPal',
                icon: '/assets/logos/paypal.png',
                type: 'digital_wallet',
                country: 'INT',
                currency: 'USD',
                minAmount: 1,
                maxAmount: 10000,
                fees: { percentage: 3.4, fixed: 0.3 }
            },
            bank_transfer: {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                icon: '/assets/icons/bank-transfer.svg',
                type: 'bank',
                country: 'ET',
                currency: 'ETB',
                minAmount: 100,
                maxAmount: 500000,
                fees: { percentage: 0, fixed: 15 }
            }
        };
        
        this.selectedMethod = null;
        this.transaction = null;
        this.init();
    }
    
    init() {
        this.loadSavedPaymentMethod();
        this.setupEventListeners();
        this.setupPaymentForms();
    }
    
    loadSavedPaymentMethod() {
        const savedMethod = localStorage.getItem('preferredPaymentMethod');
        if (savedMethod && this.paymentMethods[savedMethod]) {
            this.selectedMethod = savedMethod;
        }
    }
    
    setupEventListeners() {
        // Payment method selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.payment-method')) {
                const methodId = e.target.closest('.payment-method').dataset.method;
                this.selectPaymentMethod(methodId);
            }
        });
        
        // Payment form submission
        document.addEventListener('submit', async (e) => {
            if (e.target.matches('#paymentForm')) {
                e.preventDefault();
                await this.processPayment(e.target);
            }
        });
        
        // QR code generation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.generate-qr')) {
                this.generateQRCode();
            }
        });
    }
    
    setupPaymentForms() {
        // Set up Ethiopian payment forms
        this.setupEthiopianPayments();
        
        // Set up international payment forms
        this.setupInternationalPayments();
    }
    
    selectPaymentMethod(methodId) {
        if (!this.paymentMethods[methodId]) {
            console.error('Invalid payment method:', methodId);
            return;
        }
        
        this.selectedMethod = methodId;
        localStorage.setItem('preferredPaymentMethod', methodId);
        
        // Update UI
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        
        const selectedEl = document.querySelector(`[data-method="${methodId}"]`);
        if (selectedEl) {
            selectedEl.classList.add('selected');
        }
        
        // Show appropriate payment form
        this.showPaymentForm(methodId);
        
        // Update fees display
        this.updateFeesDisplay();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('paymentMethodSelected', {
            detail: { method: this.paymentMethods[methodId] }
        }));
    }
    
    showPaymentForm(methodId) {
        // Hide all forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show selected form
        const formId = `paymentForm_${methodId}`;
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
        }
    }
    
    async processPayment(form) {
        if (!this.selectedMethod) {
            alert('Please select a payment method');
            return;
        }
        
        const formData = new FormData(form);
        const paymentData = Object.fromEntries(formData);
        
        // Validate amount
        const amount = parseFloat(paymentData.amount) || 0;
        const method = this.paymentMethods[this.selectedMethod];
        
        if (amount < method.minAmount) {
            alert(`Minimum amount is ${method.minAmount} ${method.currency}`);
            return;
        }
        
        if (amount > method.maxAmount) {
            alert(`Maximum amount is ${method.maxAmount} ${method.currency}`);
            return;
        }
        
        // Calculate fees
        const fees = this.calculateFees(amount, method);
        const totalAmount = amount + fees;
        
        // Create transaction
        this.transaction = {
            id: 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            method: this.selectedMethod,
            amount: amount,
            fees: fees,
            total: totalAmount,
            currency: method.currency,
            status: 'pending',
            timestamp: new Date(),
            userData: paymentData
        };
        
        // Show loading state
        this.showLoading(true);
        
        try {
            // Process payment based on method
            let result;
            
            switch (this.selectedMethod) {
                case 'telebirr':
                case 'cbe':
                case 'amole':
                    result = await this.processEthiopianPayment(this.transaction);
                    break;
                    
                case 'visa':
                case 'paypal':
                    result = await this.processInternationalPayment(this.transaction);
                    break;
                    
                case 'bank_transfer':
                    result = await this.processBankTransfer(this.transaction);
                    break;
                    
                default:
                    throw new Error('Unsupported payment method');
            }
            
            if (result.success) {
                await this.handlePaymentSuccess(result);
            } else {
                await this.handlePaymentFailure(result);
            }
            
        } catch (error) {
            console.error('Payment processing error:', error);
            await this.handlePaymentFailure({
                success: false,
                error: error.message || 'Payment processing failed'
            });
        } finally {
            this.showLoading(false);
        }
    }
    
    async processEthiopianPayment(transaction) {
        // Simulate Ethiopian payment gateway API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate API response
                resolve({
                    success: Math.random() > 0.1, // 90% success rate
                    transactionId: transaction.id,
                    reference: 'REF_' + Date.now(),
                    message: 'Payment processed successfully'
                });
            }, 2000);
        });
    }
    
    async processInternationalPayment(transaction) {
        // Simulate international payment gateway API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate API response
                resolve({
                    success: Math.random() > 0.05, // 95% success rate
                    transactionId: transaction.id,
                    gateway: this.selectedMethod,
                    message: 'Payment authorized'
                });
            }, 3000);
        });
    }
    
    async processBankTransfer(transaction) {
        // Generate bank transfer details
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: transaction.id,
                    bankDetails: {
                        bank: 'Commercial Bank of Ethiopia',
                        accountNumber: '1000001234567',
                        accountName: 'Job Portal Ethiopia',
                        branch: 'Main Branch',
                        swiftCode: 'CBETETAA',
                        reference: transaction.id
                    }
                });
            }, 1000);
        });
    }
    
    async handlePaymentSuccess(result) {
        // Update transaction status
        this.transaction.status = 'completed';
        this.transaction.completedAt = new Date();
        this.transaction.reference = result.reference;
        
        // Save transaction
        this.saveTransaction(this.transaction);
        
        // Update user premium status
        await this.updatePremiumStatus();
        
        // Show success message
        this.showSuccessMessage();
        
        // Redirect to success page
        setTimeout(() => {
            window.location.href = 'payment-success.html?transaction=' + this.transaction.id;
        }, 2000);
        
        // Send notification
        notificationSystem.addNotification({
            type: 'payment',
            title: 'Payment Successful',
            message: `Your payment of ${this.transaction.amount} ${this.transaction.currency} was processed successfully.`,
            data: { transactionId: this.transaction.id },
            priority: 'high'
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('paymentCompleted', {
            detail: { transaction: this.transaction, result }
        }));
    }
    
    async handlePaymentFailure(result) {
        // Update transaction status
        this.transaction.status = 'failed';
        this.transaction.failedAt = new Date();
        this.transaction.error = result.error;
        
        // Save transaction
        this.saveTransaction(this.transaction);
        
        // Show error message
        this.showErrorMessage(result.error);
        
        // Redirect to failure page
        setTimeout(() => {
            window.location.href = 'payment-failed.html?transaction=' + this.transaction.id;
        }, 2000);
        
        // Send notification
        notificationSystem.addNotification({
            type: 'error',
            title: 'Payment Failed',
            message: result.error || 'Payment processing failed. Please try again.',
            data: { transactionId: this.transaction.id },
            priority: 'high'
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('paymentFailed', {
            detail: { transaction: this.transaction, error: result.error }
        }));
    }
    
    saveTransaction(transaction) {
        // Get existing transactions
        let transactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
        
        // Add new transaction
        transactions.unshift(transaction);
        
        // Keep only last 50 transactions
        if (transactions.length > 50) {
            transactions = transactions.slice(0, 50);
        }
        
        // Save to localStorage
        localStorage.setItem('paymentTransactions', JSON.stringify(transactions));
        
        // Also save to server if user is logged in
        if (localStorage.getItem('authToken')) {
            api.post('/payments', transaction).catch(console.error);
        }
    }
    
    async updatePremiumStatus() {
        // Update user's premium status
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.premium = true;
        user.premiumSince = new Date();
        user.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update on server
        if (localStorage.getItem('authToken')) {
            await api.patch('/profile/premium', {
                premium: true,
                expiry: user.premiumExpiry
            });
        }
    }
    
    calculateFees(amount, method) {
        const fees = method.fees;
        return (amount * fees.percentage / 100) + fees.fixed;
    }
    
    updateFeesDisplay() {
        if (!this.selectedMethod) return;
        
        const method = this.paymentMethods[this.selectedMethod];
        const amountInput = document.getElementById('paymentAmount');
        
        if (amountInput && amountInput.value) {
            const amount = parseFloat(amountInput.value);
            const fees = this.calculateFees(amount, method);
            const total = amount + fees;
            
            // Update display
            const feesEl = document.getElementById('paymentFees');
            const totalEl = document.getElementById('paymentTotal');
            
            if (feesEl) {
                feesEl.textContent = fees.toFixed(2);
            }
            
            if (totalEl) {
                totalEl.textContent = total.toFixed(2);
            }
        }
    }
    
    generateQRCode() {
        if (!this.transaction) return;
        
        // Generate QR code data for mobile money
        const qrData = {
            type: 'payment',
            merchant: 'Job Portal Ethiopia',
            account: '0912345678',
            amount: this.transaction.amount,
            currency: this.transaction.currency,
            reference: this.transaction.id,
            timestamp: this.transaction.timestamp.toISOString()
        };
        
        const qrString = JSON.stringify(qrData);
        
        // Generate QR code using a library (in production, use a QR code library)
        const qrContainer = document.getElementById('qrCodeContainer');
        if (qrContainer) {
            qrContainer.innerHTML = `
                <div class="text-center">
                    <div class="mb-3">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}" 
                             alt="Payment QR Code" class="img-fluid">
                    </div>
                    <p class="text-muted small">Scan this QR code with your mobile money app to pay</p>
                </div>
            `;
        }
    }
    
    showLoading(show) {
        const loadingEl = document.getElementById('paymentLoading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'block' : 'none';
        }
    }
    
    showSuccessMessage() {
        // Create success message
        const message = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                Payment processed successfully! Redirecting...
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.showMessage(message);
    }
    
    showErrorMessage(error) {
        // Create error message
        const message = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${error || 'Payment failed. Please try again.'}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.showMessage(message);
    }
    
    showMessage(html) {
        const container = document.getElementById('paymentMessages') || document.body;
        const messageEl = document.createElement('div');
        messageEl.innerHTML = html;
        container.prepend(messageEl.firstElementChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.firstElementChild) {
                messageEl.firstElementChild.remove();
            }
        }, 5000);
    }
    
    // Utility methods
    formatCurrency(amount, currency = 'ETB') {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    getTransactionHistory() {
        const transactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
        return transactions;
    }
    
    getTransactionById(id) {
        const transactions = this.getTransactionHistory();
        return transactions.find(t => t.id === id);
    }
}

// Create singleton instance
const paymentSystem = new PaymentSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = paymentSystem;
} else {
    window.paymentSystem = paymentSystem;
}
