import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  input: any;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  pic: string;
  service: string = "none";
  bio: string;
  joindate: any;
  isServiceProvider: boolean = false;
  isLoading: boolean = false;
  id: any
  selectedService: any;
  user: any;
  originalServiceProvider: any;
  selected = 'selectCountry';
  constructor(private router: Router,
    private http: HttpClient,
    private apiService: ApiServiceService,
    private spinner: NgxSpinnerService) {
  }

  totalLeaves = 24;
  remainingLeaves = 24;
  appliedLeaves: number;
  reason?: string;
  from: any;
  to: any;
  status: string = 'Pending'
  attendance: any;
  leaves: any;
  editProfileForm: FormGroup;
  p: number = 1;
  ngOnInit(): void {
    this.editProfileForm = new FormGroup({
      fullname: new FormControl(this.fullname),
      email: new FormControl(this.email),
      bio: new FormControl(this.bio),
      password: new FormControl(this.password),
      confirmPassword: new FormControl(this.confirmPassword),
    })

    this.spinner.show();
    const user = localStorage.getItem('User');
    if (user == null) {
      this.router.navigateByUrl('/userlogin', { replaceUrl: true })
    }
    // else {
    //   this.http.get(`user`).subscribe(res => {
    //     this.user = res;
    //     this.originalServiceProvider = res;
    //   },
    //     error => {
    //       console.log(error)
    //     })
    // }
    // comparing data of database user with loggedIn user (credentials stored in local storage)
    if (user !== null) {
      const loggedInUser = JSON.parse(user)
      console.log(loggedInUser.fullname)
      this.id = loggedInUser._id
      delete loggedInUser.password
      this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
        //logged in user
        this.user = res;
        this.fullname = this.user.fullname;
        this.email = this.user.email;
        this.pic = this.user.pic;
        this.bio = this.user.bio;
        // getting attendance of logged in user
        this.attendance = this.user.attendance;
        this.attendance = this.attendance.reverse();
        this.attendance.map((a: any) => {
          if (a.exit == undefined || !a.exit) {
            a.exit = ''
          }
        });
        this.leaves = this.user.leaves;
        // getting remaining leaves , total leaves and updating leaves data on databse
        // [res].map((n: any) => {
        //   if (loggedInUser._id == n._id) {
        //     if ((n.remainingLeaves) === undefined) {
        //       this.remainingLeaves = this.totalLeaves;
        //     }
        //     else {
        //       this.remainingLeaves = n.remainingLeaves;
        //       this.totalLeaves = this.remainingLeaves;
        //       //updating total leaves in database;
        //       this.applyLeave();
        //     }
        //   }
        // })

      },
        error => {
          console.log(error);
        })
    }
  }

  // onServiceSelect(e: any) {
  //   this.user = this.originalServiceProvider
  //   this.selectedService = e.detail.value
  //   if (e.detail.value == "All") {
  //     this.user = this.originalServiceProvider
  //   }
  //   else {
  //     this.user = this.user.filter((serviceProv: any) => {
  //       return serviceProv.service == this.selectedService
  //     })
  //   }
  // }

  userLogout() {
    this.apiService.userlogout();
  }


  onUpdateValues() {
    this.isLoading = true;
    const loggedInUser = localStorage.getItem('User');
    let user = {
      fullname: this.editProfileForm.value.fullname,
      email: this.editProfileForm.value.email,
      password: this.editProfileForm.value.password,
      bio: this.editProfileForm.value.bio,
    }
    if (this.editProfileForm.value.password !== this.editProfileForm.value.confirmPassword) {
      this.isLoading = false;
      Swal.fire({title:'', text:'Passwords do no match!', icon:'warning', timer:1000});
      return;
    }
    else if (loggedInUser !== null) {
      let parsedData = JSON.parse(loggedInUser);
      this.id = parsedData["_id"];
      this.http.put(`${this.apiService.url}/users/update/${this.id}`, user).subscribe(res => {
        this.isLoading = false;
        Swal.fire({title:'Success!', text:'Data saved succussfully!', icon:'success', timer:1000});
      }, error => {
        // Error 
        this.isLoading = false;
        Swal.fire('Error!', error, 'error');
        console.log(error);
      })
    }
  }

  applyLeaveForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
    reason: new FormControl(this.reason)
  })

  applyLeave() {
    this.appliedLeaves = (+this.applyLeaveForm.value.to.slice(8) - +this.applyLeaveForm.value.from.slice(8) + 1);
    const loggedInUser = localStorage.getItem('User');
    const leaves = {
      reason: this.applyLeaveForm.value.reason,
      from: this.applyLeaveForm.value.from,
      to: this.applyLeaveForm.value.to,
      status: this.status
    }
    if (leaves.to < leaves.from) {
      Swal.fire({title:'', text:'Please provide valid dates', icon:'warning', timer:1000});
    }
    else {
      if (!leaves.reason) {
        Swal.fire('', 'Please give a reason for leave', 'warning');
      }
      else {
        if (!this.user.appliedLeaves) {
          this.user.appliedLeaves = (+this.applyLeaveForm.value.to.slice(8) - +this.applyLeaveForm.value.from.slice(8));
        }
        const leaveManagement = {
          totalLeaves: this.user.totalLeaves,
          remainingLeaves: this.user.remainingLeaves,
          appliedLeaves: Number(this.user.appliedLeaves) + Number(this.appliedLeaves)
        }
        if (!this.user.totalLeaves) {
          leaveManagement.totalLeaves = this.totalLeaves;
        }
        if (!this.user.remainingLeaves) {
          leaveManagement.remainingLeaves = this.remainingLeaves;
        }

        if (loggedInUser !== null) {
          let parsedData = JSON.parse(loggedInUser);
          this.id = parsedData["_id"];
          this.isLoading = true;
          this.http.post(`${this.apiService.url}/users/${this.id}/apply`, leaves).subscribe(() => {
            this.isLoading = false;
            Swal.fire('Success!', 'Applied leave succesfully!', 'success');
            this.router.navigate(['/leaves', parsedData.fullname+'-'+parsedData["_id"]]);
          }, error => {
            Swal.fire('Error!', error.statusText, 'error');
          })

          this.http.post(`${this.apiService.url}/users/insert/${this.id}`, leaveManagement,{responseType: 'text'}).subscribe(() => {
            this.isLoading = false;
          }, error => {
            Swal.fire('Error!', error.statusText, 'error');
          })
        }
      }
    }
  }


  getAttendance: boolean = false;
  getApplyLeave: boolean = false;
  popUp: boolean = false;

  onGetAttendance() {
    this.getAttendance = true;
    this.getApplyLeave = false;
  }
  onGetSettings() {
    this.getAttendance = false;
    this.getApplyLeave = false;
  }
  onGetApplyLeave() {
    this.getAttendance = false;
    this.getApplyLeave = true;
  }
  openForm() {
    this.popUp = true;
  }
  closeForm() {
    this.popUp = false;
  }

}
