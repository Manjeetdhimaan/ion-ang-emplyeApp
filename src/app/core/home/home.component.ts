import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router) { }
  isEmploye:boolean=false;
  ngOnInit(): void {
    const admin = localStorage.getItem('admin');
    const user = localStorage.getItem('User');
    if(user){
      this.isEmploye = true;
    }
   
    if(admin){
      this.isEmploye = false;
    }
    if (user === null && admin === null) {
      this.router.navigateByUrl('/userlogin', { replaceUrl: true })
    }
  }
}
