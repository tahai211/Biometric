import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class paramCommonService {

    constructor(private http: HttpClient) {

    }

    getBranchList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/paramcommon/get-branh-list', req, CONST.httpOptions);
    }
    
}