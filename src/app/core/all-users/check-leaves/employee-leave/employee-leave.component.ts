import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient,
     private apiService: ApiServiceService,
      private spinner: NgxSpinnerService,
      private router: ActivatedRoute) { }
  id: any;
  user: any;
  leaves: any;
  p: number = 1;
  status: any;
  isLoading: boolean = false;
  users:any

  ngOnInit(): void {
    this.spinner.show();
    this.isLoading = true;
    const item = (localStorage.getItem('selectedUserLeave'));
    const loggedInUser = (localStorage.getItem('User'));
    const admin = (localStorage.getItem('admin'));
    // if(admin){
    //   this.isEmployee = false;
    // }
    if (item !== null) {
      let parsedData = JSON.parse(item);
      this.id = parsedData["_id"];
     
    }
    if (item == null && loggedInUser !== null) {
      let parsedDataOLoggedInuser = JSON.parse(loggedInUser);
      const a = parsedDataOLoggedInuser.fullname.toLowerCase().split(' ')
      this.id = parsedDataOLoggedInuser["_id"];
      this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
        //logged in user
        this.user = res;
      
      },
        error => {
          console.log(error);
        })
    }


    this.http.get(`${this.apiService.url}/users`).subscribe(res => {
      this.users = res;
      this.router.params.subscribe((param:Params)=>{
        this.users.map((a: any) => {
        if(param.name.split('-').join(' ').toLowerCase()==a.fullname.toLowerCase()+` ${a._id}`){
         this.user = a;
         this.leaves = this.user.leaves.reverse();
         this.isLoading = false;
        }
        else{
          this.isLoading=false;
        }
        })
      })
    },
      error => {
        console.log(error);
        this.isLoading = false;
      })
  }

  onRespondLeave(selected: any, event: any) {
    let matched = false;
    let b = '';
    this.leaves.map((a: any) => {
      if (a._id == selected._id && a.status == event.target.value) {
        Swal.fire('', `Already ${event.target.value}`, 'warning')
           matched = true;
           return;
      }
    })
    //getting previous leave status
    this.leaves.map((n: any) => {
      if (n._id == selected._id) {
        b = n.status;
      }
    })
    if(matched==false){
      this.isLoading = true;
      let credentials = {
        id: selected._id,
        event: event.target.value,
        prevStatus:b
      }
      this.http.put(`${this.apiService.url}/users/updateLeaveStatus/${this.user._id}`, credentials).subscribe(res => {
        //logged in user
        this.isLoading = false;
        this.user = res;
        // getting leaves of logged in user
        this.leaves = this.user.leaves.reverse();
      },
        error => {
          console.log(error);
          this.isLoading = false;
        })
    }
    matched = false;
  }

  getCustomCss(status: any) {
    //Logic here;
    if (status == "Approved") {
      return 'success';
    }
    if (status == "Denied") {
      return 'danger';
    }
    return 'warn';
  }
  ngOnDestroy() {
    localStorage.removeItem('selected userLeave');
  }
}
