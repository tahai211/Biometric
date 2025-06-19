import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";

@Injectable({
    providedIn: 'root',
})
export class InboxService {
    constructor(
        private http: HttpClient,
    ) {}

    getRequestVerification(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/inbox/get-request-verification', req, CONST.httpOptions);
    }

    getTransactionInbox(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/inbox/get-transaction-inbox', req, CONST.httpOptions);
    }

    getInboxFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/inbox/get-inbox-filter', req, CONST.httpOptions);
    }
}
