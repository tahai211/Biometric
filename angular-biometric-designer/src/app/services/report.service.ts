import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class reportService {

    constructor(private http: HttpClient) {

    }

    getParamReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/paraminreport', req, CONST.httpOptions);
    }
    getListParam(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/listparam', req, CONST.httpOptions);
    }
    getDetailReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/detailreport', req, CONST.httpOptions);
    }
    updateReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/updatereport', req, CONST.httpOptions);
    }

    createReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/createreport', req, CONST.httpOptions);
    }
    deleteReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/deletereport', req, CONST.httpOptions);
    }
    createParamReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/createparam', req, CONST.httpOptions);
    }
    updateParamReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/updateparam', req, CONST.httpOptions);
    }
    detailParamReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/detailparam', req, CONST.httpOptions);
    }
    getListReport(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/report/listreport', req, CONST.httpOptions);
    }
    // cancelCardNew(req: any): Observable<any> {
    //     return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardnew', req, CONST.httpOptions);
    // }

}