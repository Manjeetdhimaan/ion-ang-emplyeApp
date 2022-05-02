  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

  
  @Component({
    selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
  })
  export class ProfileComponent implements OnInit {
    fullname: string;
    email: string;
    password: string;
    pic: string;
    service: string = "none";
    bio: string;
    joindate: any;
    isServiceProvider: boolean = false;
    isLoading: boolean = false;
    id: any
    selectedService: any;
    user: any;
    selectedUser:any
    editProfile=true
    editAttendance= false;
    originalServiceProvider: any;
    isEmployee:boolean=true;
    attendance:any['']
    p: number = 1;
    remainingLeaves:any;
    paramName:any
  
    constructor(private router: Router,
      private http: HttpClient,
    private apiService: ApiServiceService) { }
  
    ngOnInit(): void {  
      const user = localStorage.getItem('User');
      const selectedUser = localStorage.getItem('selected user')
      if (user === null && selectedUser === null) {
        this.router.navigateByUrl('/adminlogin', { replaceUrl: true })
  
      }
      // else {
      //   this.http.get(`users`).subscribe(res => {
      //     this.users = res;
      //     this.originalServiceProvider = res;
      //   },
      //     error => {
      //       console.log(error)
      //     })
      // }
  
  
      // comparing data of database users with loggedIn user (credentials stored in local storage)
      if (user !== null ) {
        const loggedInUser = JSON.parse(user);
        this.id = loggedInUser._id;
        delete loggedInUser.password
        this.http.get(`${this.apiService.url}/users/${loggedInUser._id}`).subscribe(res => {
          this.user = res;
          this.paramName = this.user.fullname.toLowerCase().split(' ').join('-');
          this.paramName = this.paramName+'-'+loggedInUser._id
          this.attendance = this.user.attendance.reverse();
          this.attendance.map((a: any) => {
            if (a.exit == undefined || !a.exit) {
              a.exit = ''
            }
          });
          // this.users.map((val: any) => {
          //   val.map((a: any) => {
          //     if (specificUser.email == a.email) {
          //       this.users = a;
          //     }
          //   })
          // })
        },
          error => {
            console.log(error)
          })
      }
      if (selectedUser !== null ) {
        const newSelectedUser = JSON.parse(selectedUser)
        delete newSelectedUser.password
        this.http.get(`${this.apiService.url}/users/${newSelectedUser._id}`).subscribe(res => {
          this.selectedUser = res;
          // this.users.map((val: any) => {
          //   val.map((a: any) => {
          //     if (specificUser.email == a.email) {
          //       this.users = a;
          //     }
          //   })
          // })
        },
          error => {
            console.log(error)
          })
      }
    }
  
    onServiceSelect(e: any) {
      this.user = this.originalServiceProvider
      this.selectedService = e.detail.value
      if (e.detail.value == "All") {
        this.user = this.originalServiceProvider
      }
      else {
        this.user = this.user.filter((serviceProv: any) => {
          return serviceProv.service == this.selectedService
        })
      }
    }
  
  
    logout() {
      localStorage.removeItem('User');
      this.router.navigateByUrl('/login', { replaceUrl: true })
    }
  
  
    onUpdateValues(event: any) {
      const loggedInUser = localStorage.getItem('User');
      let user = {
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        service: this.service,
        bio: this.bio,
        joindate: this.joindate,
        isServiceProvider: this.isServiceProvider,
      }
  
      if (loggedInUser !== null) {
        let parsedData = JSON.parse(loggedInUser);
        this.id = parsedData["_id"]
        this.http.put(`${this.apiService.url}/users/update/${this.id}`, user).subscribe(res => {
        }, error => {
          console.log(error);
        })
      }
    }
  
  
  
   
  }
  