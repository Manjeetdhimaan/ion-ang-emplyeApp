"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserProfileComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var UserProfileComponent = /** @class */ (function () {
    function UserProfileComponent(router, http, apiService, spinner) {
        this.router = router;
        this.http = http;
        this.apiService = apiService;
        this.spinner = spinner;
        this.service = "none";
        this.isServiceProvider = false;
        this.isLoading = false;
        this.selected = 'selectCountry';
        this.totalLeaves = 24;
        this.remainingLeaves = 24;
        this.status = 'Pending';
        this.p = 1;
        this.applyLeaveForm = new forms_1.FormGroup({
            from: new forms_1.FormControl(),
            to: new forms_1.FormControl(),
            reason: new forms_1.FormControl(this.reason)
        });
        this.getAttendance = false;
        this.getApplyLeave = false;
        this.popUp = false;
    }
    UserProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.editProfileForm = new forms_1.FormGroup({
            fullname: new forms_1.FormControl(this.fullname),
            email: new forms_1.FormControl(this.email),
            bio: new forms_1.FormControl(this.bio),
            password: new forms_1.FormControl(this.password),
            confirmPassword: new forms_1.FormControl(this.confirmPassword)
        });
        this.spinner.show();
        var user = localStorage.getItem('User');
        if (user == null) {
            this.router.navigateByUrl('/userlogin', { replaceUrl: true });
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
            var loggedInUser = JSON.parse(user);
            this.id = loggedInUser._id;
            delete loggedInUser.password;
            this.http.get("users/" + this.id).subscribe(function (res) {
                //logged in user
                _this.user = res;
                _this.fullname = _this.user.fullname;
                _this.email = _this.user.email;
                _this.pic = _this.user.pic;
                _this.bio = _this.user.bio;
                // getting attendance of logged in user
                _this.attendance = _this.user.attendance;
                _this.attendance = _this.attendance.reverse();
                _this.attendance.map(function (a) {
                    if (a.exit == undefined || !a.exit) {
                        a.exit = '';
                    }
                });
                _this.leaves = _this.user.leaves;
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
            }, function (error) {
                console.log(error);
            });
        }
    };
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
    UserProfileComponent.prototype.userLogout = function () {
        this.apiService.userlogout();
    };
    UserProfileComponent.prototype.onUpdateValues = function () {
        var _this = this;
        this.isLoading = true;
        var loggedInUser = localStorage.getItem('User');
        var user = {
            fullname: this.editProfileForm.value.fullname,
            email: this.editProfileForm.value.email,
            password: this.editProfileForm.value.password,
            bio: this.editProfileForm.value.bio
        };
        if (this.editProfileForm.value.password !== this.editProfileForm.value.confirmPassword) {
            this.isLoading = false;
            sweetalert2_1["default"].fire({ title: '', text: 'Passwords do no match!', icon: 'warning', timer: 1000 });
            return;
        }
        else if (loggedInUser !== null) {
            var parsedData = JSON.parse(loggedInUser);
            this.id = parsedData["_id"];
            this.http.put("users/update/" + this.id, user).subscribe(function (res) {
                _this.isLoading = false;
                sweetalert2_1["default"].fire({ title: 'Success!', text: 'Data saved succussfully!', icon: 'success', timer: 1000 });
            }, function (error) {
                // Error 
                _this.isLoading = false;
                sweetalert2_1["default"].fire('Error!', error, 'error');
                console.log(error);
            });
        }
    };
    UserProfileComponent.prototype.applyLeave = function () {
        var _this = this;
        this.appliedLeaves = (+this.applyLeaveForm.value.to.slice(8) - +this.applyLeaveForm.value.from.slice(8) + 1);
        var loggedInUser = localStorage.getItem('User');
        var leaves = {
            reason: this.applyLeaveForm.value.reason,
            from: this.applyLeaveForm.value.from,
            to: this.applyLeaveForm.value.to,
            status: this.status
        };
        if (leaves.to < leaves.from) {
            sweetalert2_1["default"].fire({ title: '', text: 'Please provide valid dates', icon: 'warning', timer: 1000 });
        }
        else {
            if (!leaves.reason) {
                sweetalert2_1["default"].fire('', 'Please give a reason for leave', 'warning');
            }
            else {
                if (!this.user.appliedLeaves) {
                    this.user.appliedLeaves = (+this.applyLeaveForm.value.to.slice(8) - +this.applyLeaveForm.value.from.slice(8));
                }
                var leaveManagement = {
                    totalLeaves: this.user.totalLeaves,
                    remainingLeaves: this.user.remainingLeaves,
                    appliedLeaves: Number(this.user.appliedLeaves) + Number(this.appliedLeaves)
                };
                if (!this.user.totalLeaves) {
                    leaveManagement.totalLeaves = this.totalLeaves;
                }
                if (!this.user.remainingLeaves) {
                    leaveManagement.remainingLeaves = this.remainingLeaves;
                }
                if (loggedInUser !== null) {
                    var parsedData = JSON.parse(loggedInUser);
                    this.id = parsedData["_id"];
                    this.isLoading = true;
                    this.http.post("users/" + this.id + "/apply", leaves).subscribe(function () {
                        _this.isLoading = false;
                        _this.router.navigateByUrl('/leaves');
                        sweetalert2_1["default"].fire('Success!', 'Applied leave succesfully!', 'success');
                    }, function (error) {
                        sweetalert2_1["default"].fire('Error!', error.statusText, 'error');
                    });
                    this.http.post("users/insert/" + this.id, leaveManagement).subscribe(function () {
                        _this.isLoading = false;
                    }, function (error) {
                        sweetalert2_1["default"].fire('Error!', error.statusText, 'error');
                    });
                }
            }
        }
    };
    UserProfileComponent.prototype.onGetAttendance = function () {
        this.getAttendance = true;
        this.getApplyLeave = false;
    };
    UserProfileComponent.prototype.onGetSettings = function () {
        this.getAttendance = false;
        this.getApplyLeave = false;
    };
    UserProfileComponent.prototype.onGetApplyLeave = function () {
        this.getAttendance = false;
        this.getApplyLeave = true;
    };
    UserProfileComponent.prototype.openForm = function () {
        this.popUp = true;
    };
    UserProfileComponent.prototype.closeForm = function () {
        this.popUp = false;
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-user-profile',
            templateUrl: './user-profile.component.html',
            styleUrls: ['./user-profile.component.scss']
        })
    ], UserProfileComponent);
    return UserProfileComponent;
}());
exports.UserProfileComponent = UserProfileComponent;
