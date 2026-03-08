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
            if (role === 'ADMIN') {
                payload.realm_access.roles = [Role.ADMIN];
            } else if (role === 'COURIER') {
                payload.realm_access.roles = [Role.COURIER];
            } else if (role === 'SENDER') {
                payload.realm_access.roles = [Role.SENDER];
            }
        });
        return payload;
    }
}