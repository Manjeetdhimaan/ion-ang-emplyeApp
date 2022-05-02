import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private router :Router) { }
  url:string='http://localhost:8080';

  userlogout() {
    Swal.fire({ 
      title: 'You will be logged out',  
      text: 'Are you sure you wish to sign out?',  
      icon: 'question',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, log me out!',  
      cancelButtonText: 'No, keep me sign in'
    }).then((result) => {
      if (result.value) {  
        // Swal.fire(  
        //   'Logged out!',  
        //   'You are logged out.',  
        //   'success'  
        // )  
        this.router.navigateByUrl('/userlogin', { replaceUrl: true });
        localStorage.removeItem('User');
      } else if (result.dismiss === Swal.DismissReason.cancel) {  
        return; 
      }  
    })
    
  }

  adminLogout(){
    Swal.fire({
      title: 'You will be logged out',
      text: 'Are you sure you wish to sign out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, keep me sign in'
    }).then((result) => {
      if (result.value) {
        // Swal.fire(  
        //   'Logged out!',  
        //   'You are logged out.',  
        //   'success'  
        // )  
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/adminlogin', { replaceUrl: true })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    })
  }
}
