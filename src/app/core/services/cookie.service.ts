import { ɵparseCookieValue } from '@angular/common';
import { Injectable } from '@angular/core';

/**
 * Service for managing browser cookies (set, get, destroy).
 */
@Injectable({
    providedIn: 'root'
})
export class CookieService {
    /**
     * Sets a cookie with the given name, value, and expiration in days.
     * @param name The name of the cookie.
     * @param value The value to store.
     * @param days Number of days until expiration.
     */
    set(name: string, value: string, days: number): void {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 3600 * 1000);
        let expires = 'expires=' + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
    /**
     * Deletes a cookie by name.
     * @param name The name of the cookie to delete.
     */
    destroy(name: string): void {
        this.set(name, '', 0);
    }
    /**
     * Gets the value of a cookie by name.
     * @param name The name of the cookie to retrieve.
     * @returns The cookie value or null if not found.
     */
    get(name: string): string | null {
        const cDecoded = decodeURIComponent(document.cookie);
        return ɵparseCookieValue(cDecoded, name);
    }
}
