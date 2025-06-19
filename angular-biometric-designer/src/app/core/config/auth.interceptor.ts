import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, finalize, map, switchMap, take, timeout } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.services';
import { SpinnerOverlayService } from 'src/app/services/spinneroverlay.service';
import { AuthService } from 'src/app/services/auth.service';
const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private totalRequests = 0;

  constructor(
    private spinnerOverlayService: SpinnerOverlayService,
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    // console.log('handle-request-http: ', req);
    let authReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      // var auth = JSON.parse(token);
      authReq = this.addTokenHeader(req, token);
    }
    this.totalRequests++;
    this.spinnerOverlayService.setLoading(true);
    // if (authReq.url.includes('refresh')) {
    //   spinnerSubscription.unsubscribe();
    // }
    return next.handle(authReq)
      .pipe(map((event: HttpEvent<any>) => {
        // console.log('123: ', event);
        // if (event instanceof HttpResponse && ~~(event.status / 100) > 3) {
        if (event instanceof HttpResponse && event.status == 200) {
          console.info('HttpResponse-200::event =', event, ';');
          if (event != null && event.body !== null && event.body.resCode != null) {
            if (event.body.resCode == '401') {
              throw new HttpErrorResponse({
                error: "Hết phiên làm việc, vui lòng đăng nhập lại!",
                headers: event.headers,
                status: 501,
                statusText: 'Error',
                url: event.url || undefined
              });
            }
            else if (event.body.resCode == '900') {
              throw new HttpErrorResponse({
                error: 'Phát sinh lỗi trong quá trình vận hành, vui lòng thử lại sau!',
                headers: event.headers,
                status: 500,
                statusText: 'Error',
                url: event.url || undefined
              });
            }
            else if (event.body.resCode != '000') {
              throw new HttpErrorResponse({
                error: event.body.resDesc,
                headers: event.headers,
                status: 203,
                statusText: 'Error',
                url: event.url || undefined
              });
            }
          }
        } else {
          console.info('HttpResponse-!200::event =', event, ';');
        }
        // this.spinnerOverlayService.setLoading(false);
        return event;
      }))
      .pipe(catchError(error => {
        try {
          console.log('error: ', error);

          // var checkReponse = this.httpResponseService.getResponseText(error.status);
          // if (checkReponse != null) {
          //   this.spinnerOverlayService.setLoading(false);
          //   return throwError(() => checkReponse);
          // }
          if (error.status === 0) {
            return throwError(() => new HttpErrorResponse({
              error: 'Kết nối đến máy chủ bị gián đoạn!',
              status: error.status,
              statusText: error.statusText,
              url: error.url || undefined
            }));
          }
          if (error.status === 403) {
            return throwError(() => new HttpErrorResponse({
              error: 'Không có quyền thao tác chức năng!',
              status: error.status,
              statusText: error.statusText,
              url: error.url || undefined
            }));
          }
          if (error.status === 406 || error.status === 415) {
            return throwError(() => new HttpErrorResponse({
              error: 'Phát sinh lỗi trong quá trình xử lý yêu cầu!',
              status: error.status,
              statusText: error.statusText,
              url: error.url || undefined
            }));
          }
          if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/login') && error.status === 401) {
            console.log('handle-401-error');
            return this.handle401Error(authReq, next, token);
            // this.tokenService.logout();
            // return throwError(() => new HttpErrorResponse({
            //   error: 'Hết phiên làm việc, vui lòng đăng nhập lại!',
            //   status: error.status,
            //   statusText: error.statusText,
            //   url: error.url || undefined
            // }));
          }
          this.spinnerOverlayService.setLoading(false);
        } catch {
          this.spinnerOverlayService.setLoading(false);
          this.tokenService.logout();
        }
        return throwError(() => error);
      }))
      .pipe(finalize(() => {
        // this.totalRequests--;
        // console.log('totalRequests: ', this.totalRequests);
        // if (this.totalRequests == 0) {
        console.log('finished call api!');
        this.spinnerOverlayService.setLoading(false);
        // }
      }))
      .pipe(timeout({
        each: 180000,
        with: () => throwError(() => "Request timed out!")
      }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, token: string | null) {
    console.log(new Date(), 'handle401Error - refresh_token: ', this.isRefreshing);
    if (this.isRefreshing === false) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshtoken = this.tokenService.getRefreshToken();
      console.log('refreshtoken: ', refreshtoken);
      if (refreshtoken != null && refreshtoken != '') {
        var req = {
          refresh_token: refreshtoken,
        }
        console.log('req-refreshtoken: ', req);
        return this.authService.refreshToken(req).pipe(
          switchMap((res: any) => {
            console.log('response-refreshtoken: ', res);
            this.isRefreshing = false;
            this.tokenService.setAuthFromLocalStorage(res);
            this.refreshTokenSubject.next(res.access_token);

            this.spinnerOverlayService.setLoading(false);
            return next.handle(this.addTokenHeader(request, res.access_token));
          }),
          catchError(err => {
            console.log('response-refreshtoken-err: ', err);
            this.isRefreshing = false;
            this.spinnerOverlayService.setLoading(false);
            this.tokenService.logout();
            // if (err.error != null && err.error.message != null && err.error.message.includes('The specified token is invalid'))
            //   return throwError(() => 'Hết phiên làm việc, vui lòng đăng nhập lại!');
            return throwError(() => err);
          })
        );
      } else {
        this.isRefreshing = false;
        this.spinnerOverlayService.setLoading(false);
        this.tokenService.logout();
      }
    }
    // else {
    //   this.spinnerOverlayService.setLoading(false);
    // }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    // return request.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${token}`,
    //   }
    // });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
