import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {  ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiServiceService,
     private router: Router,
     private http: HttpClient,
     private spinner:NgxSpinnerService,
    private activatedRoute: ActivatedRoute) { }
  @Input() editProfile:boolean=false;
  @Input() editAttendance:boolean = true;
  @Input() user: any
  attendance: any;
  isLoading: boolean = false;
  id: any
  popUp: boolean = false;
  p: number = 1
  paramName:any;
  isEmployee:boolean = false;
  remainingLeaves:any= 24;
  leaveArray:any[]=[];
  users:any;
  param:any;
  ngOnInit(): void {
    this.popUp=false
    this.spinner.show();
    this.isLoading=true;
    const item = (localStorage.getItem('selected user'));
    const loggedInUser = (localStorage.getItem('User'));
    const admin = (localStorage.getItem('admin'));
    if(admin){
      this.isEmployee = false;
    }
    if (item !== null && loggedInUser == null) {
      let parsedData = JSON.parse(item);
      this.id = parsedData["_id"];
      this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
        //logged in user
        this.user = res;
        this.attendance = this.user.attendance.reverse();
        this.attendance.map((a: any) => {
          if (a.exit == undefined || !a.exit) {
            a.exit = ''
          }
        });
      },
        error => {
          console.log(error);
        })
     
    }
 
    // if (item == null && loggedInUser !== null) {
    //   this.isEmployee = true;
    //   let parsedDataOLoggedInuser = JSON.parse(loggedInUser);
    //   const a = parsedDataOLoggedInuser.fullname.toLowerCase().split(' ')
    //   this.paramName = a.join('-');
    //   this.id = parsedDataOLoggedInuser["_id"];
    //   this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
    //     //logged in user
    //     this.user = res;
    //     this.attendance = this.user.attendance.reverse();
    //     this.attendance.map((a: any) => {
    //       if (a.exit == undefined || !a.exit) {
    //         a.exit = ''
    //       }
    //     });
    //   },
    //     error => {
    //       console.log(error);
    //     })
    // }
    this.http.get(`${this.apiService.url}/users`).subscribe(res => {
      this.users = res;
     this.activatedRoute.params.subscribe((param:Params)=>{
       this.param = param
      this.users.map((a: any) => {
        if(param.name.split('-').join(' ').toLowerCase()==a.fullname.toLowerCase()+` ${a._id}`){
          this.user = a;
          this.attendance =  this.user.attendance.reverse();
                this.attendance.map((a: any) => {
                  if (a.exit == undefined || !a.exit) {
                    a.exit = ''
                  }
                });
          this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
                //logged in user
                this.user = a;
                this.attendance =  this.user.attendance.reverse();
                this.attendance.map((a: any) => {
                  if (a.exit == undefined || !a.exit) {
                    a.exit = ''
                  }
                });
              },
                error => {
                  console.log(error);
                })
          this.isLoading=false;
        }
      
        this.leaveArray.push(a.leaves)
          this.attendance = a.attendance.reverse();
        this.attendance.map((a: any) => {
          if (a.exit == undefined || !a.exit) {
            a.exit = ''
          }
        });
      })
     })
  
      this.isLoading= false;
      // this.originalServiceProvider = res;
    },
      error => {
        console.log(error)
        this.isLoading= false;
      })
     
  }

  checkIn() {
    this.isLoading = true;
    this.http.post(`${this.apiService.url}/users/${this.id}/enter`, this.id).subscribe((res) => {
      this.isLoading = false;
      console.log(res)
      Swal.fire('Success!', `${this.user.fullname.toUpperCase()} Checked In!`, 'success');
      this.router.navigateByUrl('/allusers');
    }, error => {
      // Error 
      this.isLoading = false;
      Swal.fire('', `${error.error.text}`, 'warning');
    })
  }


 

  exitType: string = "Full day";
  profileForm = new FormGroup({
    exitType: new FormControl(this.exitType),
  });

  checkOut() {
    this.isLoading = true;
    this.popUp = false;
    const credentials = {
      exitType: this.profileForm.value.exitType
    }

    if(credentials.exitType == '' || !credentials.exitType){
      Swal.fire('Error', `Please provide exit type`, 'warning');
      this.isLoading = false;
    }
    else{
      this.http.post(`${this.apiService.url}/users/${this.id}/exit`, credentials).subscribe((res) => {
        this.isLoading = false;
        Swal.fire('Success!', `${this.user.fullname.toUpperCase()} Checked out! `, 'success');
        this.router.navigateByUrl('/allusers');
      }, error => {
        // Error 
        this.isLoading = false;
        Swal.fire('', `${error.error.text}`, 'warning');
      })
    }
  }
  openForm() {
    this.popUp = true;
  }
  closeForm() {
    this.popUp = false;
  }

  dowbloadPdf() {
    this.isLoading = true;
    this.http.get(`${this.apiService.url}/users/${this.id}/overview`).subscribe((res) => {
      this.isLoading = false;
      console.log(res);
      Swal.fire('Success!', `${this.user.fullname.toUpperCase()} attendence pdf downloading!`, 'success');
    }, error => {
      // Error 
      console.log(error)
      this.isLoading = false;
      Swal.fire('', `${error.error.text}`, 'warning');
    })
  }
  @ViewChild('htmlData') htmlData:ElementRef;

 
  public openPDF():void {
    let DATA = document.getElementsByClassName('htmlData') as HTMLCollectionOf<HTMLElement>;;
        
    html2canvas(DATA[0]).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save('angular-demo.pdf');
    });     
    }
    onNavigateToSalaryComponent(){
      this.router.navigate(['salary', this.id]);
    }
    onNavigateToViewSalaryComponent(){
      this.router.navigate(['viewsalary', this.id]);
    }

  ngOnDestroy(){
    localStorage.removeItem('selected user')
  }
}
    