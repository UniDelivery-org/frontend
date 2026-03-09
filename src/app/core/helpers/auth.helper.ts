import { inject, Injectable } from "@angular/core";
import { CookieService } from "../services/cookie.service";

@Injectable({
    providedIn: "root"
})
export class AuthHelper{
    private cookie = inject(CookieService);
    public isAuthenticated(): boolean{
        return !!this.cookie.get('accessToken');
    }
}