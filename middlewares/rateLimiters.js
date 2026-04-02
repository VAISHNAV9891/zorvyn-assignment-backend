import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    // Strict -> prevent brute-force login attacks
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: { success: false, message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    // For general browsing, fetching records, etc.
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests allowed
    message: { success: false, message: "Too many requests, please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});