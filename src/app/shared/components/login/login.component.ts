import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  redirectUrl: string = '';
  isAuthenticating = false;
  constructor(
    // private userService: UserService,
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService) { 
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.redirectUrl = params['lastUrl'] || '/';
        // this.router.navigateByUrl(this.redirectUrl);
      });
  }

  onSubmit() {
    // console.log(this.loginForm.getRawValue());
    // this.auth.getAppConfig();
    this.auth.authenticate(this.loginForm.getRawValue())
      .subscribe(x => {
        console.log(x);
        this.router.navigateByUrl(this.redirectUrl);
      });
  }

  // login() {
  //   if (this.username && this.password) {
  //     this.userService.login(this.username);
  //     this.router.navigateByUrl(this.redirectUrl);
  //   }
  // }

}
