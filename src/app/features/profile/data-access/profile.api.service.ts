import { inject, Injectable } from "@angular/core";
import { UpdateProfileRequestDTO } from "./update-profile.dto";
import { map, Observable, of } from "rxjs";
import { Profile } from "../profile";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn:"root"
})
export class ProfileService{
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly apiVersion = environment.apiVersion;
    public load(): Observable<Profile>{
        return this.http.get<Profile>(`${this.apiUrl}/${this.apiVersion}/users/profile`);
    }
    public update(payload: UpdateProfileRequestDTO): Observable<Profile>{
        return this.http.put<Profile>(`${this.apiUrl}/${this.apiVersion}/users/update`, payload);
    }
    public delete(): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${this.apiVersion}/users/profile`);
    }
}