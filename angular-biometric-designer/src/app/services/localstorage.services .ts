import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})

export class LocalstorageService {
    private LocalStorage1 = "LocalStorage1";
    private LocalStorage2 = "LocalStorage2";
    constructor(
      private router: Router,
    ) {
       
    }
    public setLocalStorage(keyObject: any, object: any) {

        window.localStorage.removeItem(keyObject);
        window.localStorage.setItem(keyObject, JSON.stringify(object));
    }
    public getLocalStorage(keyObject: any): any | undefined {
        try {
            const object = window.localStorage.getItem(keyObject);
            if (!object) {
                return undefined;
            }
            return JSON.parse(object || '{}');
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
    public setLocalStorageWithURL(keyObject: any, object: any) {
        
        const router_url = this.router.url.split('?')[0].split('#')[0];
        const storageKey = `${router_url}_${keyObject}`;

        window.localStorage.removeItem(storageKey);
        window.localStorage.setItem(storageKey, JSON.stringify(object));
    }
    public getLocalStorageWithURL(keyObject: any): any | undefined {
        try {

            const router_url = this.router.url.split('?')[0].split('#')[0];
            const storageKey = `${router_url}_${keyObject}`;

            const object = window.localStorage.getItem(storageKey);
            window.localStorage.removeItem(storageKey);
            if (!object) {
                return undefined;
            }
            return JSON.parse(object || '{}');
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}