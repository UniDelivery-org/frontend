import { inject, Injectable } from "@angular/core";
import { CookieService } from "./cookie.service";
import { Role } from "../models/models";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private cookie = inject(CookieService);
    public getRole(): Role {
        return this.cookie.get('role') as Role;
    }
    public setRole(role: Role): void {
        this.cookie.set('role', role, 1);
    }
    public deleteRole(): void {
        this.cookie.destroy('role');
    }
}