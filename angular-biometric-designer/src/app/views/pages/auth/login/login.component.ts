import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  username: string = '';
  password: string = '';

  notifyUsername: string = '';
  notifyPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  onLoggedin() {
    if (!this.username || this.username.length < 3 || this.username.length > 50) {
      this.notifyUsername = "Tên đăng nhập phải từ 3 đến 50 ký tự.";
      return;
    }

    const pattern = /^[a-zA-Z0-9-@.]*$/;
    if (!pattern.test(this.username)) {
      this.notifyUsername = "Tên đăng nhập chỉ được chứa chữ cái, số, dấu '-' hoặc '@' và '.'";
      return;
    }

    if (!this.password || this.password.length < 6 || this.password.length > 300) {
      this.notifyPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
      return;
    }

    this.notifyUsername = '';
    this.notifyPassword = '';
    
    var req = {
      user_name: this.username,
      password: this.password
    }
    this.authService.login(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.tokenService.setAuthFromLocalStorage(res);
        this.isLoadingSubject.next(false)
        this.router.navigate([this.returnUrl]);
      },
      err => {
        console.log(new Date(), err);
        this.isLoadingSubject.next(false)
        this.notificationService.alertError(err.error);
      }
    );
  }

}
