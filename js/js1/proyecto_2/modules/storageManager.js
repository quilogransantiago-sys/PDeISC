const COOKIE_NAME = 'iphone_sales';
const COOKIE_EXPIRY_DAYS = 7;

export function saveToLocalStorage(sales) {
    localStorage.setItem('iphone_sales', JSON.stringify(sales));
}
export function loadFromLocalStorage() {
    const data = localStorage.getItem('iphone_sales');
    return data ? JSON.parse(data) : [];
}

export function saveToSessionStorage(sales) {
    sessionStorage.setItem('iphone_sales_session', JSON.stringify(sales));
}
export function loadFromSessionStorage() {
    const data = sessionStorage.getItem('iphone_sales_session');
    return data ? JSON.parse(data) : [];
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/`;
}
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) {
            const valueStr = c.substring(nameEQ.length);
            try { return JSON.parse(decodeURIComponent(valueStr)); } catch (e) { return []; }
        }
    }
    return [];
}
export function saveToCookies(sales) {
    setCookie(COOKIE_NAME, sales, COOKIE_EXPIRY_DAYS);
}
export function loadFromCookies() {
    return getCookie(COOKIE_NAME);
}