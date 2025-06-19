import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { CONST } from "../shared/const/const";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})

export class TokenService {
    private authLocalStorageToken = "CIMP_ACCESS_TOKEN";
    private authLocalStorageRefreshToken = "CIMP_REFRESH_TOKEN";
    helper = new JwtHelperService();

    constructor(
        private router: Router,
    ) {

    }
    logout() {
        console.log("reomve token");
        this.removeToken();
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
        // this.keyCloakService.logout();
    }

    // public saveToken() {
    //     this.keyCloakService.getToken().then(token => {
    //         console.log('token', token);
    //         window.sessionStorage.removeItem(this.authLocalStorageToken);
    //         window.sessionStorage.setItem(this.authLocalStorageToken, token);
    //         return token;
    //     });
    // }

    public setAuthFromLocalStorage(auth: any): boolean {
        // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
        if (auth && auth.access_token) {
            // localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            window.sessionStorage.removeItem(this.authLocalStorageToken);
            window.sessionStorage.setItem(this.authLocalStorageToken, auth.access_token);
            window.sessionStorage.removeItem(this.authLocalStorageRefreshToken);
            window.sessionStorage.setItem(this.authLocalStorageRefreshToken, auth.refresh_token);
            return true;
        }
        return false;
    }

    public getAuthFromLocalStorage(): any | undefined {
        try {
            const lsValue = window.sessionStorage.getItem(this.authLocalStorageToken);
            if (!lsValue) {
                return undefined;
            }

            const authData = JSON.parse(lsValue);
            return authData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public getInfomationFromLocalStorage(): any | undefined {
        try {
            const token = window.sessionStorage.getItem(this.authLocalStorageToken);
            if (!token) {
                return undefined;
            }
            const userInfoFromToken = this.helper.decodeToken(token || '');
            console.log('ngOnInit userInfoFromToken: ', userInfoFromToken);
            if (userInfoFromToken != null && userInfoFromToken != '') {
                return userInfoFromToken;
            }
            return null;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    checkLogin(): boolean {
        var token = window.sessionStorage.getItem(this.authLocalStorageToken);
        console.log("localstorate: ", token);
        if (token == null || token == '')
            return false;
        return true;
    }
    public getToken(): string | null {
        return window.sessionStorage.getItem(this.authLocalStorageToken);
    }
    public getRefreshToken(): string | null {
        return window.sessionStorage.getItem(this.authLocalStorageRefreshToken);
    }
    removeToken(): void {
        window.sessionStorage.clear();
    }
}