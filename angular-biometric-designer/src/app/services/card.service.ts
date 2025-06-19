import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";

@Injectable({
    providedIn: 'root',
})
export class CardService {
    constructor(
        private http: HttpClient,
    ) {}

    getCardInfoFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/get-card-info-filter', req, CONST.httpOptions);
    }

    searchStatusCardInfo(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/search-status-card-info', req, CONST.httpOptions);
    }

    getCardInfoDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/get-card-info-detail', req, CONST.httpOptions);
    }

    updateStatusCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/update-status-card', req, CONST.httpOptions);
    }

    cancelStatusCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/cancel-status-card', req, CONST.httpOptions);
    }

    getInfoCardUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/get-info-card-user', req, CONST.httpOptions);
    }

    getUserForAuth(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/get-user-for-auth', req, CONST.httpOptions);
    }

    handOverCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/hand-over-card', req, CONST.httpOptions);
    }

    activeCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/active-card', req, CONST.httpOptions);
    }

    approveHandOverCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/approve-hand-over-card', req, CONST.httpOptions);
    }

    getInfoCardApproveUser(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/get-info-card-approve-user', req, CONST.httpOptions);
    }

    excelStatusCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/excel-status-card', req, {
            headers: new HttpHeaders({}), 
            responseType: 'blob' as 'json'  
        })
    }

    generateQRBatch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/cardmanage/generate-qr-batch', req, CONST.httpOptions);
    }
}