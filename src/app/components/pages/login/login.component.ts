import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private userService: UserService
  ){}

  async login(){
    try {
      const response = await this.userService.login()
      console.log({response});
    } catch (error) {
      console.log({error});
    }
  }
}
