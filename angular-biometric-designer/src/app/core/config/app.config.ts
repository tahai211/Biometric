import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAppConfig } from './IAppConfig';
import { CONST } from 'src/app/shared/const/const';
// import { AUTHCONFIG } from '../shared/const/auth.config';
@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(
        private http: HttpClient
    ) { }
    load() {
        // console.log("enviroment: ", environment);
        console.log("enviroment_name: ", environment.name);
        const jsonFile = `./assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response) => {
                console.log(new Date(), response);
                AppConfig.settings = <IAppConfig>response;

                CONST.API_URL = AppConfig.settings.apis.apiUrl;
                CONST.API_HELPDESK_URL = AppConfig.settings.apis.apiHelpdeskUrl;
                CONST.API_OAUTH = AppConfig.settings.oAuthConfig.issuer;
                CONST.API_OAUTH_REALM = AppConfig.settings.oAuthConfig.realm;
                CONST.API_OAUTH_CLIENT_ID = AppConfig.settings.oAuthConfig.clientId;
                
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}