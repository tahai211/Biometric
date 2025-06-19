import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
    ) {

    }

    login(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/auth/login', req, CONST.httpOptions);
    }
    refreshToken(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/auth/refresh-token', req, CONST.httpOptions);
    }
}