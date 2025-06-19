import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CONST } from "../shared/const/const";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class svCardService {

    constructor(private http: HttpClient) {

    }

    getCustomerDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-customer-detail', req, CONST.httpOptions);
    }
    getCardByCustomer(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-card-by-customer', req, CONST.httpOptions);
    }
    getCardProcessingList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardprocessing-list', req, CONST.httpOptions);
    }
    cancelCardProcessing(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardprocessing', req, CONST.httpOptions);
    }

    getCardNewList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardnew-list', req, CONST.httpOptions);
    }
    getCardNewDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardnew-detail', req, CONST.httpOptions);
    }
    getCardNewRlosDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardnewrlos-detail', req, CONST.httpOptions);
    }
    createCardNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/create-cardnew', req, CONST.httpOptions);
    }
    authCardNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/auth-cardnew', req, CONST.httpOptions);
    }
    rejectCardNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/reject-cardnew', req, CONST.httpOptions);
    }
    cancelCardNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardnew', req, CONST.httpOptions);
    }

    getCardReNewList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardrenew-list', req, CONST.httpOptions);
    }
    getCardReNewDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardrenew-detail', req, CONST.httpOptions);
    }
    getCardReNewRlosDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardrenewrlos-detail', req, CONST.httpOptions);
    }
    createCardReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/create-cardrenew', req, CONST.httpOptions);
    }
    authCardReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/auth-cardrenew', req, CONST.httpOptions);
    }
    rejectCardReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/reject-cardrenew', req, CONST.httpOptions);
    }
    cancelCardReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardrenew', req, CONST.httpOptions);
    }

    getReleaseBatchDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-releasebatch-detail', req, CONST.httpOptions);
    }
    createCardReleaseBatch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/create-cardreleasebatch', req);
    }

    getBatchList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/getBatchList', req, CONST.httpOptions);
    }
    createBatchList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/createBatchList', req, CONST.httpOptions);
    }
    createBatchListItem(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/createBatchListItem', req, CONST.httpOptions);
    }
    getBatchListSearch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/getBatchListSearch', req, CONST.httpOptions);
    }
    getBatchListAuth(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/GetBatchListAuth', req, CONST.httpOptions);
    }
    AuthBatchListCancel(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svCard/AuthBatchListCancel', req, CONST.httpOptions);
    }
    AuthBatchListDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svCard/AuthBatchListDetail', req, CONST.httpOptions);
    }
    AuthBatchListSendBatch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svCard/AuthBatchListSendBatch', req, CONST.httpOptions);
    }

    getCardStatementListSearch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/getCardStatementList', req, CONST.httpOptions);
    }
    getCardListSearch(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/getCardList', req, CONST.httpOptions);
    }
    getCustommerInfo(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/getCustommerInfo', req, CONST.httpOptions);
    }
    getCardManagerDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardmanager-detail', req, CONST.httpOptions);
    }

    //Card Reissuance Account
    getChangeAccountCardList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardreissuance-acc-list', req, CONST.httpOptions);
    }
    createCardReissuanceAcc(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/create-cardreissuance-acc', req, CONST.httpOptions);
    }
    authCardReissuanceAcc(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/auth-cardreissuance-acc', req, CONST.httpOptions);
    }
    rejectCardReissuanceAcc(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/reject-cardreissuance-acc', req, CONST.httpOptions);
    }
    cancelCardReissuanceAcc(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardreissuance-acc', req, CONST.httpOptions);
    }
    getCardReissuanceAccDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardreissuance-acc-detail', req, CONST.httpOptions);
    }

    getCardReNewExtendList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardrenew-extend-list', req, CONST.httpOptions);
    }
    getCardReNewExtendDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/get-cardrenew-extend-detail', req, CONST.httpOptions);
    }
    createCardReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/create-cardrenew-extend', req, CONST.httpOptions);
    }
    authCardReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/auth-cardrenew-extend', req, CONST.httpOptions);
    }
    rejectCardReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/reject-cardrenew-extend', req, CONST.httpOptions);
    }
    cancelCardReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/svcard/cancel-cardrenew-extend', req, CONST.httpOptions);
    }


    //Credit
    getCardCreditReNewList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/getlist', req, CONST.httpOptions);
    }
    getCardCreditReNewDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/getdetail', req, CONST.httpOptions);
    }
    createCardCreditReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/create', req, CONST.httpOptions);
    }
    authCardCreditReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/auth', req, CONST.httpOptions);
    }
    rejectCardCreditReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/reject', req, CONST.httpOptions);
    }
    cancelCardCreditReNew(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/cancel', req, CONST.httpOptions);
    }

    getCardCreditReNewExtendList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/getlist-extend', req, CONST.httpOptions);
    }
    getCardCreditReNewExtendDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/getdetail-extend', req, CONST.httpOptions);
    }
    createCardCreditReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/create-extend', req, CONST.httpOptions);
    }
    authCardCreditReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/auth-extend', req, CONST.httpOptions);
    }
    rejectCardCreditReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/reject-extend', req, CONST.httpOptions);
    }
    cancelCardCreditReNewExtend(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/cancel-extend', req, CONST.httpOptions);
    }

    getCardCreditByCustomer(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/renewcreditcard/get-card-by-customer', req, CONST.httpOptions);
    }

    createCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/create-credit-card', req, CONST.httpOptions);
    }

    inspectorAuthCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/inspector-auth-credit', req, CONST.httpOptions);
    }

    cardCenterAuthCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/card-center-auth-credit', req, CONST.httpOptions);
    }

    inspectorRejectCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/inspector-reject-credit', req, CONST.httpOptions);
    }

    cardCenterRejectCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/card-center-reject-credit', req, CONST.httpOptions);
    }

    cancelCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/cancel-credit-card', req, CONST.httpOptions);
    }


    getRegisterOnlinePaymentList(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/getlist-paymentonline', req, CONST.httpOptions);
    }
    getRegisterOnlinePaymentDetail(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/getdetail-paymentonline', req, CONST.httpOptions);
    }
    createRegisterOnlinePayment(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/create-paymentonline', req, CONST.httpOptions);
    }
    authRegisterOnlinePayment(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/auth-paymentonline', req, CONST.httpOptions);
    }
    rejectRegisterOnlinePayment(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/reject-paymentonline', req, CONST.httpOptions);
    }
    cancelRegisterOnlinePayment(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/cancel-paymentonline', req, CONST.httpOptions);
    }

    getListCreditCardChangeInfo(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/get-list-credit-card-change-info', req, CONST.httpOptions);
    }

    getAdjustCreditCardFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/get-adjust-credit-card-filter', req, CONST.httpOptions);
    }

    getAdjustCreditDetailFilter(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/get-adjust-credit-detail-filter', req, CONST.httpOptions);
    }

    createAdjustCreditCard(req: any): Observable<any> {
        return this.http.post<any>(CONST.API_URL + 'api/credit/create-adjust-credit-card', req, CONST.httpOptions);
    }
}