import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-check-leaves',
  templateUrl: './check-leaves.component.html',
  styleUrls: ['./check-leaves.component.scss']
})
export class CheckLeavesComponent implements OnInit {
  constructor(private router: Router,
    private http: HttpClient,
    private apiService: ApiServiceService,
    private spinner: NgxSpinnerService) { }

  users: any;
  selectedUser: any;
  leaveArray: any[] = [];
  counter: any = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.spinner.show();
    this.isLoading = true;
    const admin = localStorage.getItem('admin');
    if (admin == null) {
      this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
      this.isLoading = false;
    }
    else {
      this.http.get(`${this.apiService.url}/users`).subscribe(res => {
        this.users = res;
        this.users.map((a: any) => {
          this.leaveArray.push(a.leaves)
          this.isLoading = false;
        })
      },
        error => {
          console.log(error);
          this.isLoading = false;
        })
    }


  }

  onSelectUser(user: any[]) {
    this.selectedUser = user;
    const a = this.selectedUser.fullname.toLowerCase().split(' ')
    const b = a.join('-');
    localStorage.setItem('selectedUserLeave', JSON.stringify(user));
    this.router.navigate(['/employeeLeaves', b+'-'+this.selectedUser._id]);
  }
}
