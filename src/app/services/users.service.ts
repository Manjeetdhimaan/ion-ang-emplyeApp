import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //getting 'user' from all-users-component's 'onSelectUser' function;
  user: any

  users:any
  leaveArray:any[]=[];

  constructor(private http: HttpClient, private apiService: ApiServiceService) {

     this.http.get(`${this.apiService.url}/users`).subscribe(res => {
      this.users = res;
      [res].map((a: any) => {
        this.leaveArray.push(a.leaves)
      })
      // console.log(this.leaveArray) 
      // this.originalServiceProvider = res;
    },
      error => {
        console.log(error);
      })
  }

  getSelectedUser() {
    const user = localStorage.getItem('selected user');
    let parsedData;
    if (user) {
      parsedData = JSON.parse(user);
    }
    if (!this.user) {
      return parsedData;
    }
    else {
      return this.user;
    }
  }
}

