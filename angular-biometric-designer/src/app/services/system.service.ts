import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";

@Injectable({
    providedIn: 'root',
})
export class SystemService {
    constructor(
        private http: HttpClient,
    ) {

    }
    getAgentList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-agent-list', req, CONST.httpOptions);
    }
    getAgentDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-agent-detail', req, CONST.httpOptions);
    }
    createAgent(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/create-agent', req, CONST.httpOptions);
    }
    updateAgent(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/update-agent', req, CONST.httpOptions);
    }
    authAgent(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/auth-agent', req, CONST.httpOptions);
    }
    rejectAgent(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/reject-agent', req, CONST.httpOptions);
    }
    cancelAgent(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/cancel-agent', req, CONST.httpOptions);
    }

    getParamList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-param-list', req, CONST.httpOptions);
    }
    getParamDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-param-detail', req, CONST.httpOptions);
    }
    updateParam(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/update-param', req, CONST.httpOptions);
    }
    
    getHistoryList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-history-list', req, CONST.httpOptions);
    }
    getHistoryFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-history-filter', req, CONST.httpOptions);
    }
    getHistoryDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-history-detail', req, CONST.httpOptions);
    }
    getBranchList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-branch-list', req, CONST.httpOptions);
    }
    getCoreDate(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-core-date', req, CONST.httpOptions);
    }

    getProductCreditList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-product-credit-list', req, CONST.httpOptions);
    }
    getProductCreditDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/get-product-credit-detail', req, CONST.httpOptions);
    }
    createProductCredit(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/create-product-credit', req, CONST.httpOptions);
    }
    updateProductCredit(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/update-product-credit', req, CONST.httpOptions);
    }
    authProductCredit(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/auth-product-credit', req, CONST.httpOptions);
    }
    rejectProductCredit(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/reject-product-credit', req, CONST.httpOptions);
    }
    cancelProductCredit(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/system/cancel-product-credit', req, CONST.httpOptions);
    }
}