const baseUrl = 'https://localhost:4200';
export const environment = {
  dxLicenseKey: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImZjNTU3ZjVlLTA0YTgtNDM1Yi05MzlhLTFmYzFhMmZhNjkzNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.ofQZg0I2zR1YuWyIeBCsDYNTRlT1W2f87C+H8TC7aGBdWOwkKqFjD7UOoLhg2X8jzFaS5UjxWPr0q98sbeDj3Etffa/aSMAY+DLbr0tIRD9ipDG+sprVBXv7h84IyqxRb4Pqcw==',
  name: "prod",
  production: true,
  ACCESS_TOKEN: 'access-token',
  appVersion: 'v1.0.0',
  // USERDATA_KEY: 'auth-token',
  isMockEnabled: true,
  // apiUrl: 'https://your-domain.com/api',
  // appThemeName: 'Metronic',
  // appHTMLIntegration: 'https://preview.keenthemes.com/metronic8/demo1/documentation/base/helpers/flex-layouts.html',
  // appPurchaseUrl: 'https://1.envato.market/EA4JP',
  // appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1/',
  // appPreviewAngularUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1',
  // appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  // appPreviewChangelogUrl: 'https://preview.keenthemes.com/metronic8/angular/docs/docs/changelog',
    
  application: {
    baseUrl,
    name: 'RPTP',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:5501/auth/',//'https://localhost:5010/',
    redirectUri: baseUrl,
    clientId: 'RPTP_Web',
    responseType: 'code',
    scope: 'offline_access RPTP',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:5501/adminapi/',//'https://localhost:5011',
      rootNamespace: 'RPTP',
    },
  },
};
