import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.scss']
})
export class ViewPayrollComponent implements OnInit {
  isLoading:boolean=false;
  isEmployee:boolean=false;
  id:any;
  user:any;
  payroll:any;
  p: number = 1;
  constructor(private activatedRoute: ActivatedRoute,
      private http:HttpClient,
      private apiService:ApiServiceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.id = param.id
    })
    const admin = localStorage.getItem('admin');
    const loggedInUser = (localStorage.getItem('User'));
    if (admin == null) {
      this.isEmployee = false;
      // this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
      this.isLoading= false;
    }
    if(loggedInUser!==null){
      this.isEmployee = true;
    }
    this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
      //logged in user
      this.user = res;
      this.payroll = this.user.payroll.sort((a:any,b:any)=> a.month.slice(0,4)-b.month.slice(0,4)).reverse();
    },
      error => {
        console.log(error);
      })
  }

}
