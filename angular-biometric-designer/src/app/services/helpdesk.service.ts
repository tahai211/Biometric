import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})

export class HelpdeskService {
    constructor(private http: HttpClient) {}

    createSupportGroup(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/create-support-group', req, CONST.httpOptions)
    }

    getSupportGroupList(req: any) : Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-support-group-list', req, CONST.httpOptions)
    }

    getListSupportGroupUser(req: any) : Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-list-support-group-user', req, CONST.httpOptions)
    }

    assignSupportGroup(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/assign-support-groups', req, CONST.httpOptions)
    }

    getReviewListFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-review-list-filter', req, CONST.httpOptions)
    }

    searchReviewList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/search-review-list', req, CONST.httpOptions)
    }

    getAddIssueNewFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-add-issue-new-filter', req, CONST.httpOptions)
    }

    insertIssue(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/insert-issue', req)
    }

    getInfoCustomer(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-info-customer', req, CONST.httpOptions)
    }

    getResponseNewFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-response-new-filter', req, CONST.httpOptions)
    }

    loadIssueDetailFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/load-issue-detail-filter', req, CONST.httpOptions)
    }

    insertResponse(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/insert-response', req)
    }

    authResponse(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/auth-response', req)
    }

    excelReviewList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/excel-review-list', req, {
            headers: new HttpHeaders({}), 
            responseType: 'blob' as 'json'  // Quan trọng: Chỉ định kiểu Blob
        })
    }

    searchTransactionNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/search-transaction-new', req, CONST.httpOptions)
    }

    getClientInfoQuery(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_HELPDESK_URL + 'api/helpdesk/get-client-info', req, CONST.httpOptions)
    }
}