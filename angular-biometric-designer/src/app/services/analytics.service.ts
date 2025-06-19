import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    constructor(
        private http: HttpClient,
    ) {

    }

    getDashboardDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/analytics/get-dashboard', req, CONST.httpOptions);
    }
}