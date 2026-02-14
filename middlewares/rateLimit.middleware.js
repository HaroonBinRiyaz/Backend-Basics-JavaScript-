import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message:{
        ok: false,
        message: "Too many login attempts, Try again in a minute."
    },
    standardHeaders: true,
    legacyHeaders: false,

});

export const registerLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 10,
    message:{
        ok: false, 
        message: "Too many accounts created. Please wait before trying again."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const refreshLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        ok: false,
        message: "Too many token refresh requests."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

//Global Api Limiter
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        ok: false,
        message: "Too many requests. Slow down."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
