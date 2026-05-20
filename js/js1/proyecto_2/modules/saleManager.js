import * as storage from './storageManager.js';
import { getModelById } from './iphoneData.js';

class SaleManager {
    constructor() {
        this.sales = storage.loadFromLocalStorage();
        this._syncAllStorages();
    }
    _syncAllStorages() {
        storage.saveToLocalStorage(this.sales);
        storage.saveToSessionStorage(this.sales);
        storage.saveToCookies(this.sales);
    }
    getAll() { return [...this.sales]; }
    add(sale) {
        const newSale = { id: Date.now(), ...sale };
        this.sales.unshift(newSale);
        this._syncAllStorages();
        return newSale;
    }
    remove(id) {
        this.sales = this.sales.filter(s => s.id !== id);
        this._syncAllStorages();
    }
    clearAll() {
        this.sales = [];
        this._syncAllStorages();
    }
    loadFromLocalStorage() {
        this.sales = storage.loadFromLocalStorage();
        this._syncAllStorages();
    }
    loadFromSessionStorage() {
        const data = storage.loadFromSessionStorage();
        if (data.length) { this.sales = data; this._syncAllStorages(); }
    }
    loadFromCookies() {
        const data = storage.loadFromCookies();
        if (data.length) { this.sales = data; this._syncAllStorages(); }
    }
    getCounts() {
        return {
            localStorage: storage.loadFromLocalStorage().length,
            sessionStorage: storage.loadFromSessionStorage().length,
            cookies: storage.loadFromCookies().length,
        };
    }
}
export default SaleManager;