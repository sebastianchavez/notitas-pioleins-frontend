import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  idLog: string = 'LoginComponent'

  constructor(
    private userService: UserService,
    private router: Router,
    private logger: LoggerService,
  ){}

  async login(){
    try {
      const response = await this.userService.login()
      this.router.navigateByUrl('/')
      this.logger.log(this.idLog, this.login.name, {info: 'Success', response})
    } catch (error) {
      this.logger.error(this.idLog, this.login.name, {info: 'Error', error})
    }
  }
}
