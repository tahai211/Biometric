export interface IAppConfig {
    env: {
        name: string,
        production: boolean,
        ACCESS_TOKEN: string,
        appVersion: string,
        isMockEnabled: boolean
    };
    application: {
        baseUrl: string,
        name: string,
        logoUrl: string,
    };
    apis: {
        apiUrl: string,
        apiHelpdeskUrl: string
    };
    oAuthConfig: {
        issuer: string,
        redirectUri: string,
        clientId: string,
        responseType: string,
        scope: string,
        requireHttps: boolean,
        realm: string
    }
}