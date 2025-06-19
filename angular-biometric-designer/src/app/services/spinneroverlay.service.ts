import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpinnerOverlayService {
    private _loading = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this._loading.asObservable().pipe(delay(1));

    private _loadingHandmade = new BehaviorSubject<boolean>(false);
    public readonly _loadingHandmade$ = this._loadingHandmade.asObservable().pipe(delay(1));

    constructor() { }

    setLoading(loading: boolean) {
        console.log("loading: ", loading);
        // console.log("this._loadingHandmade.getValue() ", this._loadingHandmade.getValue());
        // if (!this._loadingHandmade.getValue()){
        if (loading) this._loading.next(true);
        else this._loading.next(false);
        // }

    }
    setLoadingHandmade(loading: boolean) {
        console.log("loading: ", loading);

        if (loading) this._loadingHandmade.next(true);
        else this._loadingHandmade.next(false);

        if (loading) this._loading.next(true);
        else this._loading.next(false);

    }
}