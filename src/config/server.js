

 const PORT = process.env.PORT;
 const DB_NAME = process.env.DB_NAME;
 const DB_URI = process.env.DB_URI;
 const TOKEN_SECURITY_KEY = process.env.TOKEN_SECURITY_KEY.trim();
 const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
 const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
 const COOKIE_SIGN = process.env.COOKIE_SIGN;
 const MAX_DEVICE = process.env.MAX_DEVICE;
 const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
 const GMAIL_PASS = process.env.GMAIL_PASS;
 
module.exports = {
    PORT,
    DB_NAME,
    DB_URI,
    TOKEN_SECURITY_KEY,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    COOKIE_SIGN,
    MAX_DEVICE,
    GMAIL_EMAIL,
    GMAIL_PASS
}