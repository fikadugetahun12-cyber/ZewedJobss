// ethiopian-payments.js
// Comprehensive Ethiopian payment methods and utilities

class EthiopianPayments {
    constructor() {
        this.initializeBanks();
        this.initializeMobileMoney();
        this.initializePaymentTypes();
        this.initializeCurrencies();
        this.setupEventListeners();
        this.loadFromStorage();
    }
    
    initializeBanks() {
        this.ethiopianBanks = [
            {
                code: 'CBE',
                name: 'Commercial Bank of Ethiopia',
                swift: 'CBETETAA',
                logo: '/assets/logos/cbe.png',
                mobileMoney: 'CBE Birr',
                website: 'https://www.combanketh.et',
                contact: '+251115170000',
                accountNumberFormat: /^[0-9]{13}$/, // 13 digits
                routingNumber: '013',
                isStateOwned: true,
                branches: 1800,
                established: 1963
            },
            {
                code: 'BOA',
                name: 'Bank of Abyssinia',
                swift: 'ABYSETAA',
                logo: '/assets/logos/boa.png',
                mobileMoney: 'HelloCash',
                website: 'https://www.bankofabyssinia.com',
                contact: '+251116180000',
                accountNumberFormat: /^[0-9]{10,15}$/,
                routingNumber: '014',
                isStateOwned: false,
                branches: 600,
                established: 1996
            },
            {
                code: 'AWASH',
                name: 'Awash Bank',
                swift: 'AWSHETAA',
                logo: '/assets/logos/awash.png',
                mobileMoney: 'Awash Birr',
                website: 'https://www.awashbank.com',
                contact: '+251115504040',
                accountNumberFormat: /^[0-9]{10,12}$/,
                routingNumber: '015',
                isStateOwned: false,
                branches: 500,
                established: 1994
            },
            {
                code: 'DAS',
                name: 'Dashen Bank',
                swift: 'DASHETAA',
                logo: '/assets/logos/dashen.png',
                mobileMoney: 'Amole',
                website: 'https://www.dashenbanksc.com',
                contact: '+251115180000',
                accountNumberFormat: /^[0-9]{11}$/,
                routingNumber: '016',
                isStateOwned: false,
                branches: 400,
                established: 1995
            },
            {
                code: 'WEGAGEN',
                name: 'Wegagen Bank',
                swift: 'WGAGETAA',
                logo: '/assets/logos/wegagen.png',
                mobileMoney: null,
                website: 'https://www.wegagenbank.com',
                contact: '+251115544000',
                accountNumberFormat: /^[0-9]{10}$/,
                routingNumber: '017',
                isStateOwned: false,
                branches: 300,
                established: 1997
            },
            {
                code: 'NIB',
                name: 'Nib International Bank',
                swift: 'NIBIETAA',
                logo: '/assets/logos/nib.png',
                mobileMoney: null,
                website: 'https://www.nibbanksc.com',
                contact: '+251115503333',
                accountNumberFormat: /^[0-9]{12}$/,
                routingNumber: '018',
                isStateOwned: false,
                branches: 250,
                established: 1999
            },
            {
                code: 'ZEMEN',
                name: 'Zemen Bank',
                swift: 'ZEMEETAA',
                logo: '/assets/logos/zemen.png',
                mobileMoney: null,
                website: 'https://www.zemenbank.com',
                contact: '+251115157000',
                accountNumberFormat: /^[0-9]{10}$/,
                routingNumber: '019',
                isStateOwned: false,
                branches: 80,
                established: 2008
            },
            {
                code: 'ABAY',
                name: 'Abay Bank',
                swift: 'ABAYETAA',
                logo: '/assets/logos/abay.png',
                mobileMoney: null,
                website: 'https://www.abaybank.com',
                contact: '+251115585000',
                accountNumberFormat: /^[0-9]{11}$/,
                routingNumber: '020',
                isStateOwned: false,
                branches: 120,
                established: 2010
            },
            {
                code: 'BUNNA',
                name: 'Bunna International Bank',
                swift: 'BUNNETAA',
                logo: '/assets/logos/bunna.png',
                mobileMoney: null,
                website: 'https://www.bunnabank.com',
                contact: '+251115157700',
                accountNumberFormat: /^[0-9]{10}$/,
                routingNumber: '021',
                isStateOwned: false,
                branches: 90,
                established: 2009
            },
            {
                code: 'LION',
                name: 'Lion International Bank',
                swift: 'LIONETAA',
                logo: '/assets/logos/lion.png',
                mobileMoney: null,
                website: 'https://www.lionbank.com',
                contact: '+251115502220',
                accountNumberFormat: /^[0-9]{10}$/,
                routingNumber: '022',
                isStateOwned: false,
                branches: 110,
                established: 2006
            },
            {
                code: 'ENAT',
                name: 'Enat Bank',
                swift: 'ENATETAA',
                logo: '/assets/logos/enat.png',
                mobileMoney: null,
                website: 'https://www.enatbanksc.com',
                contact: '+251115501111',
                accountNumberFormat: /^[0-9]{11}$/,
                routingNumber: '023',
                isStateOwned: false,
                branches: 85,
                established: 2013
            },
            {
                code: 'ADIS',
                name: 'Addis International Bank',
                swift: 'ADISETAA',
                logo: '/assets/logos/adis.png',
                mobileMoney: null,
                website: 'https://www.addisbanksc.com',
                contact: '+251115548080',
                accountNumberFormat: /^[0-9]{10}$/,
                routingNumber: '024',
                isStateOwned: false,
                branches: 70,
                established: 2011
            }
        ];
        
        // Bank lookup by code for quick access
        this.banksByCode = {};
        this.ethiopianBanks.forEach(bank => {
            this.banksByCode[bank.code] = bank;
        });
    }
    
    initializeMobileMoney() {
        this.mobileMoneyProviders = [
            {
                id: 'telebirr',
                name: 'Telebirr',
                operator: 'Ethio Telecom',
                logo: '/assets/logos/telebirr.png',
                ussdCode: '*127#',
                website: 'https://telebirr.et',
                contact: '700',
                minAmount: 1,
                maxAmount: 50000,
                dailyLimit: 100000,
                monthlyLimit: 300000,
                fees: {
                    transfer: { percentage: 0.5, min: 1, max: 10 },
                    cashout: { percentage: 1, min: 2, max: 15 },
                    airtime: { percentage: 0, min: 0, max: 0 }
                },
                validationPattern: /^09[0-9]{8}$/,
                activeUsers: 28000000 // 28 million
            },
            {
                id: 'cbebirr',
                name: 'CBE Birr',
                operator: 'Commercial Bank of Ethiopia',
                logo: '/assets/logos/cbe-birr.png',
                ussdCode: '*847#',
                website: 'https://www.combanketh.et/cbe-birr',
                contact: '847',
                minAmount: 1,
                maxAmount: 25000,
                dailyLimit: 50000,
                monthlyLimit: 150000,
                fees: {
                    transfer: { percentage: 0.5, min: 1, max: 8 },
                    cashout: { percentage: 0.8, min: 1.5, max: 12 },
                    airtime: { percentage: 0, min: 0, max: 0 }
                },
                validationPattern: /^09[0-9]{8}$/,
                activeUsers: 12000000 // 12 million
            },
            {
                id: 'hellocash',
                name: 'HelloCash',
                operator: 'Bank of Abyssinia',
                logo: '/assets/logos/hellocash.png',
                ussdCode: '*889#',
                website: 'https://www.hellocash.com',
                contact: '889',
                minAmount: 1,
                maxAmount: 20000,
                dailyLimit: 40000,
                monthlyLimit: 120000,
                fees: {
                    transfer: { percentage: 0.6, min: 1, max: 7 },
                    cashout: { percentage: 1, min: 2, max: 10 },
                    airtime: { percentage: 0, min: 0, max: 0 }
                },
                validationPattern: /^09[0-9]{8}$/,
                activeUsers: 8000000 // 8 million
            },
            {
                id: 'awashbirr',
                name: 'Awash Birr',
                operator: 'Awash Bank',
                logo: '/assets/logos/awash-birr.png',
                ussdCode: '*810#',
                website: 'https://www.awashbirr.com',
                contact: '810',
                minAmount: 1,
                maxAmount: 15000,
                dailyLimit: 30000,
                monthlyLimit: 90000,
                fees: {
                    transfer: { percentage: 0.7, min: 1, max: 6 },
                    cashout: { percentage: 1.2, min: 2.5, max: 9 },
                    airtime: { percentage: 0, min: 0, max: 0 }
                },
                validationPattern: /^09[0-9]{8}$/,
                activeUsers: 5000000 // 5 million
            },
            {
                id: 'amole',
                name: 'Amole',
                operator: 'Dashen Bank',
                logo: '/assets/logos/amole.png',
                ussdCode: '*633#',
                website: 'https://www.amoledigital.com',
                contact: '633',
                minAmount: 1,
                maxAmount: 10000,
                dailyLimit: 20000,
                monthlyLimit: 60000,
                fees: {
                    transfer: { percentage: 0.8, min: 1, max: 5 },
                    cashout: { percentage: 1.5, min: 3, max: 8 },
                    airtime: { percentage: 0, min: 0, max: 0 }
                },
                validationPattern: /^09[0-9]{8}$/,
                activeUsers: 3000000 // 3 million
            }
        ];
        
        // Mobile money lookup by ID
        this.mobileMoneyById = {};
        this.mobileMoneyProviders.forEach(provider => {
            this.mobileMoneyById[provider.id] = provider;
        });
    }
    
    initializePaymentTypes() {
        this.paymentTypes = {
            BANK_TRANSFER: {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct bank-to-bank transfer',
                processingTime: '1-3 business days',
                minAmount: 1,
                maxAmount: 1000000,
                fees: { percentage: 0.1, min: 10, max: 100 },
                supportedBanks: 'all',
                requiresBankDetails: true
            },
            MOBILE_MONEY: {
                id: 'mobile_money',
                name: 'Mobile Money',
                description: 'Instant transfer via mobile money',
                processingTime: 'Instant',
                minAmount: 1,
                maxAmount: 50000,
                fees: { percentage: 0.5, min: 1, max: 10 },
                supportedBanks: 'mobile_money_only',
                requiresPhoneNumber: true
            },
            CASH: {
                id: 'cash',
                name: 'Cash Payment',
                description: 'Pay in person with cash',
                processingTime: 'Immediate',
                minAmount: 1,
                maxAmount: 50000,
                fees: { percentage: 0, min: 0, max: 0 },
                supportedBanks: 'none',
                requiresLocation: true
            },
            CHECK: {
                id: 'check',
                name: 'Bank Check',
                description: 'Payment via bank check',
                processingTime: '3-5 business days',
                minAmount: 100,
                maxAmount: 500000,
                fees: { percentage: 0.2, min: 15, max: 150 },
                supportedBanks: 'all',
                requiresCheckDetails: true
            },
            ONLINE_BANKING: {
                id: 'online_banking',
                name: 'Online Banking',
                description: 'Direct payment via online banking',
                processingTime: 'Instant to 24 hours',
                minAmount: 1,
                maxAmount: 200000,
                fees: { percentage: 0.15, min: 5, max: 50 },
                supportedBanks: ['CBE', 'BOA', 'AWASH', 'DAS', 'WEGAGEN'],
                requiresBankLogin: true
            },
            CARD: {
                id: 'card',
                name: 'Debit/Credit Card',
                description: 'Payment via card (Visa/Mastercard)',
                processingTime: 'Instant',
                minAmount: 1,
                maxAmount: 100000,
                fees: { percentage: 2.5, min: 5, max: 75 },
                supportedBanks: 'card_issuing_banks',
                requiresCardDetails: true
            }
        };
    }
    
    initializeCurrencies() {
        this.currencies = {
            ETB: {
                code: 'ETB',
                name: 'Ethiopian Birr',
                symbol: 'Br',
                subunit: 'Santim',
                decimals: 2,
                exchangeRate: 1,
                format: 'en-ET',
                isPrimary: true
            },
            USD: {
                code: 'USD',
                name: 'US Dollar',
                symbol: '$',
                subunit: 'Cent',
                decimals: 2,
                exchangeRate: 56.5, // Approximate rate
                format: 'en-US',
                isPrimary: false
            },
            EUR: {
                code: 'EUR',
                name: 'Euro',
                symbol: '€',
                subunit: 'Cent',
                decimals: 2,
                exchangeRate: 61.2, // Approximate rate
                format: 'en-EU',
                isPrimary: false
            },
            GBP: {
                code: 'GBP',
                name: 'British Pound',
                symbol: '£',
                subunit: 'Pence',
                decimals: 2,
                exchangeRate: 71.8, // Approximate rate
                format: 'en-GB',
                isPrimary: false
            }
        };
    }
    
    setupEventListeners() {
        // Setup global event listeners for payment forms
        document.addEventListener('DOMContentLoaded', () => {
            this.setupPaymentForms();
        });
    }
    
    loadFromStorage() {
        try {
            this.savedPaymentMethods = JSON.parse(localStorage.getItem('ethiopian_payment_methods')) || [];
            this.transactionHistory = JSON.parse(localStorage.getItem('ethiopian_payment_history')) || [];
        } catch (error) {
            console.error('Error loading payment data from storage:', error);
            this.savedPaymentMethods = [];
            this.transactionHistory = [];
        }
    }
    
    saveToStorage() {
        localStorage.setItem('ethiopian_payment_methods', JSON.stringify(this.savedPaymentMethods));
        localStorage.setItem('ethiopian_payment_history', JSON.stringify(this.transactionHistory));
    }
    
    // ==================== PUBLIC METHODS ====================
    
    // Get all banks
    getAllBanks() {
        return this.ethiopianBanks;
    }
    
    // Get bank by code
    getBankByCode(code) {
        return this.banksByCode[code] || null;
    }
    
    // Get banks with mobile money
    getBanksWithMobileMoney() {
        return this.ethiopianBanks.filter(bank => bank.mobileMoney !== null);
    }
    
    // Get all mobile money providers
    getAllMobileMoneyProviders() {
        return this.mobileMoneyProviders;
    }
    
    // Get mobile money provider by ID
    getMobileMoneyProviderById(id) {
        return this.mobileMoneyById[id] || null;
    }
    
    // Validate Ethiopian bank account number
    validateBankAccount(bankCode, accountNumber) {
        const bank = this.getBankByCode(bankCode);
        if (!bank) {
            return {
                isValid: false,
                error: 'Invalid bank code'
            };
        }
        
        if (!bank.accountNumberFormat) {
            // If no specific format, do basic validation
            const isValid = /^[0-9]{10,15}$/.test(accountNumber);
            return {
                isValid,
                error: isValid ? null : 'Account number must be 10-15 digits'
            };
        }
        
        const isValid = bank.accountNumberFormat.test(accountNumber);
        return {
            isValid,
            error: isValid ? null : `Invalid account number format for ${bank.name}`
        };
    }
    
    // Validate Ethiopian mobile money number
    validateMobileMoneyNumber(phoneNumber, providerId = null) {
        // Check if it's a valid Ethiopian phone number
        const ethiopianPattern = /^(09|9)[0-9]{8}$/;
        if (!ethiopianPattern.test(phoneNumber)) {
            return {
                isValid: false,
                error: 'Invalid Ethiopian phone number'
            };
        }
        
        // Normalize to 10 digits
        const normalizedNumber = phoneNumber.length === 9 ? `0${phoneNumber}` : phoneNumber;
        
        if (providerId) {
            const provider = this.getMobileMoneyProviderById(providerId);
            if (provider && provider.validationPattern) {
                const isValid = provider.validationPattern.test(normalizedNumber);
                return {
                    isValid,
                    error: isValid ? null : `Invalid number format for ${provider.name}`
                };
            }
        }
        
        return {
            isValid: true,
            normalizedNumber,
            error: null
        };
    }
    
    // Format Ethiopian Birr amount
    formatCurrency(amount, currencyCode = 'ETB') {
        const currency = this.currencies[currencyCode];
        if (!currency) {
            return `Br ${amount.toFixed(2)}`;
        }
        
        if (currencyCode === 'ETB') {
            return new Intl.NumberFormat(currency.format, {
                style: 'currency',
                currency: 'ETB',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } else {
            // For foreign currencies
            return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
        }
    }
    
    // Convert amount between currencies
    convertCurrency(amount, fromCurrency, toCurrency) {
        const from = this.currencies[fromCurrency];
        const to = this.currencies[toCurrency];
        
        if (!from || !to) {
            throw new Error('Invalid currency code');
        }
        
        // Convert to ETB first (base currency)
        const amountInETB = amount * from.exchangeRate;
        // Then convert to target currency
        return amountInETB / to.exchangeRate;
    }
    
    // Calculate fees for a payment
    calculateFees(amount, paymentType, providerId = null) {
        const paymentMethod = this.paymentTypes[paymentType];
        if (!paymentMethod) {
            throw new Error('Invalid payment type');
        }
        
        let fees = { ...paymentMethod.fees };
        
        // For mobile money, get specific provider fees
        if (paymentType === 'MOBILE_MONEY' && providerId) {
            const provider = this.getMobileMoneyProviderById(providerId);
            if (provider) {
                fees = provider.fees.transfer;
            }
        }
        
        // Calculate fee amount
        let feeAmount = amount * (fees.percentage / 100);
        
        // Apply minimum and maximum
        if (feeAmount < fees.min) feeAmount = fees.min;
        if (fees.max && feeAmount > fees.max) feeAmount = fees.max;
        
        const totalAmount = amount + feeAmount;
        
        return {
            amount,
            feeAmount,
            totalAmount,
            feePercentage: fees.percentage,
            feeBreakdown: {
                amount,
                fee: feeAmount,
                total: totalAmount
            }
        };
    }
    
    // Simulate payment processing
    async processPayment(paymentData) {
        const {
            amount,
            paymentType,
            providerId,
            accountNumber,
            phoneNumber,
            customerName,
            reference,
            description
        } = paymentData;
        
        // Validate required fields
        if (!amount || amount <= 0) {
            throw new Error('Invalid amount');
        }
        
        if (!paymentType) {
            throw new Error('Payment type is required');
        }
        
        // Create transaction ID
        const transactionId = this.generateTransactionId();
        
        // Simulate processing delay
        await this.simulateProcessingDelay();
        
        // Create transaction record
        const transaction = {
            id: transactionId,
            date: new Date().toISOString(),
            amount,
            paymentType,
            providerId,
            accountNumber: accountNumber || null,
            phoneNumber: phoneNumber || null,
            customerName,
            reference,
            description,
            status: 'completed',
            fees: this.calculateFees(amount, paymentType, providerId)
        };
        
        // Add to history
        this.transactionHistory.unshift(transaction);
        
        // Keep only last 100 transactions
        if (this.transactionHistory.length > 100) {
            this.transactionHistory = this.transactionHistory.slice(0, 100);
        }
        
        // Save to storage
        this.saveToStorage();
        
        // Emit event
        this.emitPaymentEvent('paymentProcessed', transaction);
        
        return transaction;
    }
    
    // Generate QR code for payment
    generatePaymentQR(data) {
        const {
            amount,
            currency = 'ETB',
            recipientName,
            recipientAccount,
            bankCode,
            description = '',
            reference = ''
        } = data;
        
        // Format QR code data according to Ethiopian standards
        const qrData = {
            v: '1', // Version
            t: 'C2B', // Transaction type (Customer to Business)
            n: recipientName,
            a: amount,
            c: currency,
            ba: recipientAccount,
            bc: bankCode,
            d: description,
            r: reference,
            ts: new Date().toISOString()
        };
        
        // Convert to string
        const qrString = Object.entries(qrData)
            .map(([key, value]) => `${key}:${value}`)
            .join('|');
        
        return qrString;
    }
    
    // Parse QR code data
    parsePaymentQR(qrString) {
        const parts = qrString.split('|');
        const data = {};
        
        parts.forEach(part => {
            const [key, value] = part.split(':');
            if (key && value !== undefined) {
                data[key] = value;
            }
        });
        
        return data;
    }
    
    // Get transaction history
    getTransactionHistory(filter = {}) {
        let transactions = [...this.transactionHistory];
        
        // Apply filters
        if (filter.startDate) {
            transactions = transactions.filter(t => new Date(t.date) >= new Date(filter.startDate));
        }
        
        if (filter.endDate) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date(filter.endDate));
        }
        
        if (filter.paymentType) {
            transactions = transactions.filter(t => t.paymentType === filter.paymentType);
        }
        
        if (filter.minAmount) {
            transactions = transactions.filter(t => t.amount >= filter.minAmount);
        }
        
        if (filter.maxAmount) {
            transactions = transactions.filter(t => t.amount <= filter.maxAmount);
        }
        
        return transactions;
    }
    
    // Get payment statistics
    getPaymentStatistics() {
        const stats = {
            totalTransactions: this.transactionHistory.length,
            totalAmount: 0,
            averageAmount: 0,
            byPaymentType: {},
            byMonth: {},
            byBank: {}
        };
        
        this.transactionHistory.forEach(transaction => {
            // Total amount
            stats.totalAmount += transaction.amount;
            
            // By payment type
            if (!stats.byPaymentType[transaction.paymentType]) {
                stats.byPaymentType[transaction.paymentType] = {
                    count: 0,
                    total: 0
                };
            }
            stats.byPaymentType[transaction.paymentType].count++;
            stats.byPaymentType[transaction.paymentType].total += transaction.amount;
            
            // By month
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!stats.byMonth[monthKey]) {
                stats.byMonth[monthKey] = {
                    count: 0,
                    total: 0
                };
            }
            stats.byMonth[monthKey].count++;
            stats.byMonth[monthKey].total += transaction.amount;
            
            // By bank (if applicable)
            if (transaction.bankCode) {
                if (!stats.byBank[transaction.bankCode]) {
                    stats.byBank[transaction.bankCode] = {
                        count: 0,
                        total: 0
                    };
                }
                stats.byBank[transaction.bankCode].count++;
                stats.byBank[transaction.bankCode].total += transaction.amount;
            }
        });
        
        // Calculate average
        if (stats.totalTransactions > 0) {
            stats.averageAmount = stats.totalAmount / stats.totalTransactions;
        }
        
        return stats;
    }
    
    // Save payment method for future use
    savePaymentMethod(methodData) {
        const method = {
            id: this.generatePaymentMethodId(),
            ...methodData,
            createdAt: new Date().toISOString(),
            isDefault: this.savedPaymentMethods.length === 0 // First method is default
        };
        
        this.savedPaymentMethods.push(method);
        this.saveToStorage();
        
        return method;
    }
    
    // Get saved payment methods
    getSavedPaymentMethods() {
        return this.savedPaymentMethods;
    }
    
    // Remove saved payment method
    removePaymentMethod(methodId) {
        const index = this.savedPaymentMethods.findIndex(m => m.id === methodId);
        if (index !== -1) {
            const removed = this.savedPaymentMethods.splice(index, 1)[0];
            this.saveToStorage();
            return removed;
        }
        return null;
    }
    
    // Set default payment method
    setDefaultPaymentMethod(methodId) {
        this.savedPaymentMethods.forEach(method => {
            method.isDefault = method.id === methodId;
        });
        this.saveToStorage();
    }
    
    // ==================== PRIVATE METHODS ====================
    
    simulateProcessingDelay() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `ETH-TX-${timestamp}-${random}`;
    }
    
    generatePaymentMethodId() {
        return `PM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    emitPaymentEvent(eventName, data) {
        const event = new CustomEvent(`ethiopianPayment:${eventName}`, {
            detail: data
        });
        document.dispatchEvent(event);
    }
    
    setupPaymentForms() {
        // Auto-format currency inputs
        document.querySelectorAll('.currency-input[data-currency="ETB"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                    e.target.value = this.formatCurrency(value);
                }
            });
            
            input.addEventListener('focus', (e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                e.target.value = value || '';
            });
        });
        
        // Phone number formatting
        document.querySelectorAll('.phone-input[data-country="ET"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0 && !value.startsWith('9')) {
                    value = '9' + value;
                }
                
                if (value.length > 9) {
                    value = value.substring(0, 9);
                }
                
                e.target.value = value;
            });
        });
        
        // Account number validation
        document.querySelectorAll('.bank-account-input').forEach(input => {
            input.addEventListener('blur', (e) => {
                const bankCode = e.target.dataset.bank;
                const accountNumber = e.target.value;
                
                if (bankCode && accountNumber) {
                    const validation = this.validateBankAccount(bankCode, accountNumber);
                    
                    if (!validation.isValid) {
                        this.showInputError(e.target, validation.error);
                    } else {
                        this.clearInputError(e.target);
                    }
                }
            });
        });
        
        // Mobile money number validation
        document.querySelectorAll('.mobile-money-input').forEach(input => {
            input.addEventListener('blur', (e) => {
                const providerId = e.target.dataset.provider;
                const phoneNumber = e.target.value;
                
                if (phoneNumber) {
                    const validation = this.validateMobileMoneyNumber(phoneNumber, providerId);
                    
                    if (!validation.isValid) {
                        this.showInputError(e.target, validation.error);
                    } else {
                        this.clearInputError(e.target);
                        // Format the number
                        if (validation.normalizedNumber) {
                            e.target.value = validation.normalizedNumber;
                        }
                    }
                }
            });
        });
        
        // Fee calculation on amount change
        document.querySelectorAll('.amount-input[data-payment-type]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.calculateAndDisplayFees(e.target);
            });
        });
    }
    
    showInputError(input, message) {
        this.clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'payment-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff0042;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
    }
    
    clearInputError(input) {
        const existingError = input.parentNode.querySelector('.payment-error');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
    }
    
    calculateAndDisplayFees(input) {
        const amount = parseFloat(input.value);
        if (isNaN(amount) || amount <= 0) return;
        
        const paymentType = input.dataset.paymentType;
        const providerId = input.dataset.provider;
        
        try {
            const fees = this.calculateFees(amount, paymentType, providerId);
            
            // Find or create fee display
            let feeDisplay = input.parentNode.querySelector('.fee-display');
            if (!feeDisplay) {
                feeDisplay = document.createElement('div');
                feeDisplay.className = 'fee-display';
                feeDisplay.style.cssText = `
                    font-size: 0.875rem;
                    color: #666;
                    margin-top: 0.5rem;
                `;
                input.parentNode.appendChild(feeDisplay);
            }
            
            feeDisplay.innerHTML = `
                <div>Amount: ${this.formatCurrency(fees.amount)}</div>
                <div>Fee: ${this.formatCurrency(fees.feeAmount)} (${fees.feePercentage}%)</div>
                <div><strong>Total: ${this.formatCurrency(fees.totalAmount)}</strong></div>
            `;
        } catch (error) {
            console.error('Error calculating fees:', error);
        }
    }
    
    // ==================== UTILITY METHODS ====================
    
    // Get Ethiopian holidays for payment processing
    getEthiopianHolidays(year = new Date().getFullYear()) {
        // Ethiopian calendar holidays (Gregorian dates)
        const holidays = [
            {
                name: 'የመስቀል በዓል (Meskel)', // Meskel
                date: `${year}-09-27`, // Usually September 27
                isPublic: true
            },
            {
                name: 'ገና (Christmas)', // Ethiopian Christmas
                date: `${year}-01-07`,
                isPublic: true
            },
            {
                name: 'ጥምቀት (Epiphany)', // Ethiopian Epiphany
                date: `${year}-01-19`,
                isPublic: true
            },
            {
                name: 'የአዲስ አመት (New Year)', // Ethiopian New Year
                date: `${year}-09-11`,
                isPublic: true
            },
            {
                name: 'የትንሳኤ በዓል (Easter)', // Ethiopian Easter
                date: this.calculateEaster(year), // Variable date
                isPublic: true
            },
            {
                name: 'የወርቅ ወንበር (Golden Throne)', // Golden Throne Day
                date: `${year}-11-02`,
                isPublic: true
            },
            {
                name: 'የአርበኞች ቀን (Patriots Day)', // Patriots Day
                date: `${year}-05-05`,
                isPublic: true
            },
            {
                name: 'የደርግ ውድቀት (Downfall of Derg)', // Downfall of Derg
                date: `${year}-05-28`,
                isPublic: true
            }
        ];
        
        return holidays;
    }
    
    calculateEaster(year) {
        // Simplified calculation for Ethiopian Easter (not exact)
        // In reality, Ethiopian Easter calculation is complex
        const easterDates = {
            2023: '2023-04-16',
            2024: '2024-05-05',
            2025: '2025-04-20',
            2026: '2026-04-12'
        };
        
        return easterDates[year] || `${year}-04-${year % 4 === 0 ? '12' : '20'}`;
    }
    
    // Check if date is a business day in Ethiopia
    isBusinessDay(date = new Date()) {
        const day = date.getDay();
        
        // Saturday (6) and Sunday (0) are weekends in Ethiopia
        if (day === 0 || day === 6) {
            return false;
        }
        
        // Check if it's a holiday
        const year = date.getFullYear();
        const holidays = this.getEthiopianHolidays(year);
        const dateStr = date.toISOString().split('T')[0];
        
        const isHoliday = holidays.some(holiday => holiday.date === dateStr);
        
        return !isHoliday;
    }
    
    // Calculate expected payment date
    calculateExpectedDate(paymentType, startDate = new Date()) {
        let date = new Date(startDate);
        
        switch (paymentType) {
            case 'MOBILE_MONEY':
            case 'ONLINE_BANKING':
            case 'CARD':
                // Instant or same day
                if (!this.isBusinessDay(date)) {
                    date = this.getNextBusinessDay(date);
                }
                break;
                
            case 'BANK_TRANSFER':
                // 1-3 business days
                date = this.addBusinessDays(date, 2);
                break;
                
            case 'CHECK':
                // 3-5 business days
                date = this.addBusinessDays(date, 4);
                break;
                
            case 'CASH':
                // Same day
                break;
        }
        
        return date;
    }
    
    getNextBusinessDay(date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        while (!this.isBusinessDay(nextDay)) {
            nextDay.setDate(nextDay.getDate() + 1);
        }
        
        return nextDay;
    }
    
    addBusinessDays(date, days) {
        let result = new Date(date);
        let addedDays = 0;
        
        while (addedDays < days) {
            result.setDate(result.getDate() + 1);
            if (this.isBusinessDay(result)) {
                addedDays++;
            }
        }
        
        return result;
    }
    
    // Generate payment receipt
    generateReceipt(transaction) {
        const receipt = {
            receiptNumber: `RCP-${Date.now()}`,
            date: new Date().toISOString(),
            transactionId: transaction.id,
            customerName: transaction.customerName,
            amount: this.formatCurrency(transaction.amount),
            fee: this.formatCurrency(transaction.fees.feeAmount),
            total: this.formatCurrency(transaction.fees.totalAmount),
            paymentMethod: transaction.paymentType,
            provider: transaction.providerId ? 
                this.getMobileMoneyProviderById(transaction.providerId)?.name || 
                this.getBankByCode(transaction.bankCode)?.name || 
                'N/A' : 'N/A',
            reference: transaction.reference,
            description: transaction.description,
            status: transaction.status
        };
        
        return receipt;
    }
    
    // Print receipt
    printReceipt(receipt) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Payment Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt { border: 1px solid #ddd; padding: 20px; max-width: 400px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #ff0042; padding-bottom: 10px; margin-bottom: 20px; }
                        .detail { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .total { border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; font-weight: bold; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>Payment Receipt</h2>
                            <p>Receipt #: ${receipt.receiptNumber}</p>
                            <p>${new Date(receipt.date).toLocaleString()}</p>
                        </div>
                        
                        <div class="detail">
                            <span>Transaction ID:</span>
                            <span>${receipt.transactionId}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Customer:</span>
                            <span>${receipt.customerName}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Amount:</span>
                            <span>${receipt.amount}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Fee:</span>
                            <span>${receipt.fee}</span>
                        </div>
                        
                        <div class="detail total">
                            <span>Total Paid:</span>
                            <span>${receipt.total}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Payment Method:</span>
                            <span>${receipt.paymentMethod}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Provider:</span>
                            <span>${receipt.provider}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Reference:</span>
                            <span>${receipt.reference}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Description:</span>
                            <span>${receipt.description}</span>
                        </div>
                        
                        <div class="detail">
                            <span>Status:</span>
                            <span style="color: green;">${receipt.status.toUpperCase()}</span>
                        </div>
                        
                        <div class="footer">
                            <p>Thank you for your payment!</p>
                            <p>Generated by Ethiopian Payments System</p>
                        </div>
                    </div>
                    
                    <script>
                        window.onload = () => window.print();
                    </script>
                </body>
            </html>
        `);
        
        printWindow.document.close();
    }
}

// Export for use in browser
window.EthiopianPayments = EthiopianPayments;

// Auto-initialize if in browser context
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ethiopianPayments) {
            window.ethiopianPayments = new EthiopianPayments();
        }
    });
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopianPayments;
}
