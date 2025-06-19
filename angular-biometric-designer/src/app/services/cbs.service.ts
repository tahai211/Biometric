import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class CBSService {

    constructor(private http: HttpClient) {

    }

    getCustomerList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cbs/get-customer-list', req, CONST.httpOptions);
    }
}