import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {
  loggedInUser: any;
  paramName: any;
  user:any;
  isNewNotification:boolean= false;
  constructor(private apiService: ApiServiceService, private http:HttpClient) { }
  ngOnInit(): void {
    const user = localStorage.getItem('User')
    if (user) {
      let loggedIn = JSON.parse(user);
      const id = loggedIn._id
      const a = loggedIn.fullname?.toLowerCase().split(' ');
      this.paramName = a?.join('-');
      this.paramName = this.paramName+'-'+id

      this.http.get(`${this.apiService.url}/users/${id}`).subscribe(res => {
      this.user = res;
      this.loggedInUser = res;

     
      },
        error => {
          console.log(error);
        })
    }
  }
  ngDoCheck(){
  
  }

  clicked(){
    
  }

  userLogout() {
    this.apiService.userlogout();
  }
}
