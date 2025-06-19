import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { MenuItem } from "../views/layout/sidebar/menu.model";

@Injectable({
    providedIn: 'root'
})
export class IdentityService {
    constructor(private http: HttpClient) {
    }

    public dataMenu: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
    public setDataMenu(_dataMenu: MenuItem[]) {
        this.dataMenu.next(_dataMenu);
    }

    getMenu(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/get-menu', req, CONST.httpOptions);
    }
    getUserList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/get-user-list', req, CONST.httpOptions);
    }
    getUserDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/get-user-detail', req, CONST.httpOptions);
    }
    getRoleList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/get-role-list', req, CONST.httpOptions);
    }
    getRoleDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/get-role-detail', req, CONST.httpOptions);
    }

    createUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/create-user', req, CONST.httpOptions);
    }
    updateUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/update-user', req, CONST.httpOptions);
    }
    authUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/auth-user', req, CONST.httpOptions);
    }
    rejectUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/reject-user', req, CONST.httpOptions);
    }
    cancelUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/cancel-user', req, CONST.httpOptions);
    }

    createRole(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/create-role', req, CONST.httpOptions);
    }
    updateRole(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/update-role', req, CONST.httpOptions);
    }
    authRole(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/auth-role', req, CONST.httpOptions);
    }
    rejectRole(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/reject-role', req, CONST.httpOptions);
    }
    cancelRole(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/cancel-role', req, CONST.httpOptions);
    }
    excelUserList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/identity/export-excel-userlist', req, CONST.httpOptions);
    }
}