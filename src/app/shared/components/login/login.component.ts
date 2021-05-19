import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  redirectUrl: string = '';
  constructor(
    // private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.redirectUrl = params['lastUrl'] || '/';
        // this.router.navigateByUrl(this.redirectUrl);
      });
  }

  // login() {
  //   if (this.username && this.password) {
  //     this.userService.login(this.username);
  //     this.router.navigateByUrl(this.redirectUrl);
  //   }
  // }

}
