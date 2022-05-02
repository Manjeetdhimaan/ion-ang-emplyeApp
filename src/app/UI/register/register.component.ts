import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  fullname: string;
  email: string;
  password: string;
  pic: string;
  service: string = "none";
  bio: string;
  joindate: any;
  isServiceProvider: boolean = false;
  isLoading: boolean = false;
  phone: string;
  loggedInUser: any;
  paramName: any
  @Input() layout = 'register';
  submitted = false;
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.spinner.show();
  }
  adminForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
  adminlogin() {
    this.isLoading = true;
    let credentials = {
      email: this.adminForm.value.email,
      password: this.adminForm.value.password,
    }
    this.http.post(`${this.apiService.url}/admin/adminLogin`, credentials).subscribe((res:any) => {
      this.isLoading = false;
      if(res['status']=='success'){
        localStorage.setItem('admin', JSON.stringify(res));
        localStorage.removeItem('User');
      this.router.navigateByUrl('/allusers', { replaceUrl: true });
      }

      else if(res['status']=='error'){
        Swal.fire('Error!', 'error.error.error', 'error');
        localStorage.removeItem('User');
      }

    }, error => {
      this.isLoading = false;
      Swal.fire('Error!', error.error.error, 'error');
    })
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  userlogin() {
    this.isLoading = true;
    let credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    console.log(credentials)
    this.http.post(`${this.apiService.url}/users/login`, credentials).subscribe((res:any) => {
      this.isLoading = false;
      let resp=JSON.stringify(res);
      console.log(resp)
      if(res['status']=='success'){
        console.log(res)
        localStorage.setItem('User', JSON.stringify(res.UserData));
        const user = localStorage.getItem('User');
        if (user) {
          console.log(user)
          const parsedData = JSON.parse(user);
          this.loggedInUser = parsedData;
          const a = parsedData?.fullname?.toLowerCase().split(' ');
          this.paramName = a?.join('-');
          localStorage.removeItem('admin');
          this.router.navigate(['profile', this.paramName+'-'+parsedData._id], { replaceUrl: true });
        }
      }
      else if(res['status']=='error'){
        Swal.fire('Error!', 'error.error.error', 'error');
        localStorage.removeItem('User');
      }
    }, error => {
      console.log(error)
      this.isLoading = false;
      Swal.fire('Error!', error.error.error, 'error');
    })
  }

  registerForm = new FormGroup({
    fullname: new FormControl(),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl(),
    phone: new FormControl(),
    pic: new FormControl(),
    service: new FormControl(),
    bio: new FormControl(),
    joindate: new FormControl(),
  })


  onRegister() {
    this.isLoading = true;
    let user = {
      fullname: this.registerForm.value.fullname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: this.registerForm.value.phone,
      pic: this.registerForm.value.pic,
      service: this.registerForm.value.service,
      bio: this.registerForm.value.bio,
      joindate: this.registerForm.value.joindate,
      isServiceProvider: this.isServiceProvider,
    }
    if (user.email == '' || !user.email) {
      // Swal.fire('Registeration Failed!', 'Email required', 'error')
      this.isLoading = false;
      this.submitted=true;
      console.log(this.registerForm.controls.email)
      
    }
    else {
      this.http.post(`${this.apiService.url}/users/register`, user)
        .subscribe(res => {
          this.isLoading = false;
          localStorage.setItem('User', JSON.stringify(res));
          // Success
          Swal.fire('Registeration successfull!', 'Login Now!', 'success');
          this.router.navigateByUrl('userlogin');
        },
          error => {
            this.isLoading = false;
            Swal.fire('Registeration Failed!', error.error.error, 'error');
          })
    }

  }
  checkValidation(){
    console.log()
    if(this.registerForm.value.email!=='' && !this.registerForm.controls.email.invalid){
      this.submitted= false;
    }
    else{
      this.submitted = true
    }
    
  }

  onServiceSelect(event: any) {
    let response = event.detail.value;
    if (response.toLowerCase() == "no") {
      this.isServiceProvider = false;
    }
    else {
      this.isServiceProvider = true;
    }
  }
}
