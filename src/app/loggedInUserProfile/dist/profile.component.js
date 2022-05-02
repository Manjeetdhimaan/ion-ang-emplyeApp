"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfileComponent = void 0;
var core_1 = require("@angular/core");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(router, http, apiService) {
        this.router = router;
        this.http = http;
        this.apiService = apiService;
        this.service = "none";
        this.isServiceProvider = false;
        this.isLoading = false;
        this.editProfile = true;
        this.editAttendance = false;
        this.isEmployee = true;
        this.p = 1;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        var user = localStorage.getItem('User');
        var selectedUser = localStorage.getItem('selected user');
        if (user === null && selectedUser === null) {
            this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
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
        if (user !== null) {
            var loggedInUser = JSON.parse(user);
            delete loggedInUser.password;
            this.http.get("users/" + loggedInUser._id).subscribe(function (res) {
                _this.user = res;
                _this.paramName = _this.user.fullname.split(' ').join('-');
                _this.attendance = _this.user.attendance.reverse();
                _this.attendance.map(function (a) {
                    if (a.exit == undefined || !a.exit) {
                        a.exit = '';
                    }
                });
                // this.users.map((val: any) => {
                //   val.map((a: any) => {
                //     if (specificUser.email == a.email) {
                //       this.users = a;
                //     }
                //   })
                // })
            }, function (error) {
                console.log(error);
            });
        }
        if (selectedUser !== null) {
            var newSelectedUser = JSON.parse(selectedUser);
            delete newSelectedUser.password;
            this.http.get("users/" + newSelectedUser._id).subscribe(function (res) {
                _this.selectedUser = res;
                // this.users.map((val: any) => {
                //   val.map((a: any) => {
                //     if (specificUser.email == a.email) {
                //       this.users = a;
                //     }
                //   })
                // })
            }, function (error) {
                console.log(error);
            });
        }
    };
    ProfileComponent.prototype.onServiceSelect = function (e) {
        var _this = this;
        this.user = this.originalServiceProvider;
        this.selectedService = e.detail.value;
        if (e.detail.value == "All") {
            this.user = this.originalServiceProvider;
        }
        else {
            this.user = this.user.filter(function (serviceProv) {
                return serviceProv.service == _this.selectedService;
            });
        }
    };
    ProfileComponent.prototype.logout = function () {
        localStorage.removeItem('User');
        this.router.navigateByUrl('/login', { replaceUrl: true });
    };
    ProfileComponent.prototype.onUpdateValues = function (event) {
        var loggedInUser = localStorage.getItem('User');
        var user = {
            fullname: this.fullname,
            email: this.email,
            password: this.password,
            service: this.service,
            bio: this.bio,
            joindate: this.joindate,
            isServiceProvider: this.isServiceProvider
        };
        if (loggedInUser !== null) {
            var parsedData = JSON.parse(loggedInUser);
            this.id = parsedData["_id"];
            this.http.put("users/update/" + this.id, user).subscribe(function (res) {
            }, function (error) {
                console.log(error);
            });
        }
    };
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.scss']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
