import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'employeeManagement';
  tab1 = 'FilmsPage';
  tab2 = 'PeoplePage';
  tab3 = 'PlanetsPage';

  constructor(private titleService: Title,
     private router: Router,
      private activatedRoute: ActivatedRoute,
      private userService: UsersService){}
  ngOnInit(){
    let userName= '';
  
    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
         const user = this.userService.getSelectedUser();
          const child = this.activatedRoute.firstChild;
          if (child?.snapshot.data['title']) {
             child.snapshot.data['title'] = userName+' - EmployeeManagment';
            return child.snapshot.data['title']
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }

  ngDoCheck(){
   
     
      }
  }

