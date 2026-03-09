import { Injectable } from "@angular/core";
import { JwtPayload } from "../models/jwtToken";
import { jwtDecode } from "jwt-decode";
import { Role } from "../models/models";

@Injectable({
    providedIn: 'root'
})
export class JwtResolverService {
    decodeToken(accessToken: string): JwtPayload {
        const payload = jwtDecode<JwtPayload>(accessToken);
        payload.realm_access.roles.forEach(role => {
            switch (role) {
                case 'ADMIN':
                    payload.realm_access.roles = [Role.ADMIN];
                    break;
                case 'COURIER':
                    payload.realm_access.roles = [Role.COURIER];
                    break;
                case 'SENDER':
                    payload.realm_access.roles = [Role.SENDER];
                    break;
                default:
                    break;
            }
        });
        return payload;
    }
}