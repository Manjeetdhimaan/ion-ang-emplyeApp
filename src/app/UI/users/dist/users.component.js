"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var UsersComponent = /** @class */ (function () {
    function UsersComponent(apiService, router, http, spinner, activatedRoute) {
        this.apiService = apiService;
        this.router = router;
        this.http = http;
        this.spinner = spinner;
        this.activatedRoute = activatedRoute;
        this.editProfile = false;
        this.editAttendance = true;
        this.isLoading = false;
        this.popUp = false;
        this.p = 1;
        this.isEmployee = false;
        this.remainingLeaves = 24;
        this.leaveArray = [];
        this.exitType = "Full day";
        this.profileForm = new forms_1.FormGroup({
            exitType: new forms_1.FormControl(this.exitType)
        });
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.popUp = false;
        this.spinner.show();
        this.isLoading = true;
        var item = (localStorage.getItem('selected user'));
        var loggedInUser = (localStorage.getItem('User'));
        var admin = (localStorage.getItem('admin'));
        if (admin) {
            this.isEmployee = false;
        }
        if (item !== null && loggedInUser == null) {
            var parsedData = JSON.parse(item);
            this.id = parsedData["_id"];
        }
        if (item == null && loggedInUser !== null) {
            this.isEmployee = true;
            var parsedDataOLoggedInuser = JSON.parse(loggedInUser);
            var a = parsedDataOLoggedInuser.fullname.toLowerCase().split(' ');
            this.paramName = a.join('-');
            this.id = parsedDataOLoggedInuser["_id"];
            this.http.get("users/" + this.id).subscribe(function (res) {
                //logged in user
                _this.user = res;
                _this.attendance = _this.user.attendance.reverse();
                _this.attendance.map(function (a) {
                    if (a.exit == undefined || !a.exit) {
                        a.exit = '';
                    }
                });
            }, function (error) {
                console.log(error);
            });
        }
        this.http.get("users").subscribe(function (res) {
            _this.users = res;
            _this.activatedRoute.params.subscribe(function (param) {
                _this.param = param;
                _this.users.map(function (a) {
                    if (param.name.split('-').join(' ').toLowerCase() == a.fullname.toLowerCase()) {
                        _this.user = a;
                        _this.http.get("users/" + _this.id).subscribe(function (res) {
                            //logged in user
                            _this.user = a;
                            _this.attendance = a.attendance;
                            _this.attendance.map(function (a) {
                                if (a.exit == undefined || !a.exit) {
                                    a.exit = '';
                                }
                            });
                        }, function (error) {
                            console.log(error);
                        });
                        _this.isLoading = false;
                    }
                    _this.leaveArray.push(a.leaves);
                    _this.attendance = a.attendance.reverse();
                    _this.attendance.map(function (a) {
                        if (a.exit == undefined || !a.exit) {
                            a.exit = '';
                        }
                    });
                });
            });
            _this.isLoading = false;
            // this.originalServiceProvider = res;
        }, function (error) {
            console.log(error);
            _this.isLoading = false;
        });
    };
    UsersComponent.prototype.checkIn = function () {
        var _this = this;
        this.isLoading = true;
        this.http.post("users/" + this.id + "/enter", this.id).subscribe(function () {
            _this.isLoading = false;
            sweetalert2_1["default"].fire('Success!', _this.user.fullname.toUpperCase() + " Checked In!", 'success');
            _this.router.navigateByUrl('/allusers');
        }, function (error) {
            // Error 
            _this.isLoading = false;
            sweetalert2_1["default"].fire('', "" + error.error.text, 'warning');
        });
    };
    UsersComponent.prototype.checkOut = function () {
        var _this = this;
        this.isLoading = true;
        this.popUp = false;
        var credentials = {
            exitType: this.profileForm.value.exitType
        };
        if (credentials.exitType == '' || !credentials.exitType) {
            sweetalert2_1["default"].fire('Error', "Please provide exit type", 'warning');
            this.isLoading = false;
        }
        else {
            this.http.post("users/" + this.id + "/exit", credentials).subscribe(function () {
                _this.isLoading = false;
                sweetalert2_1["default"].fire('Success!', _this.user.fullname.toUpperCase() + " Checked out! ", 'success');
                _this.router.navigateByUrl('/allusers');
            }, function (error) {
                // Error 
                _this.isLoading = false;
                sweetalert2_1["default"].fire('', "" + error.error.text, 'warning');
            });
        }
    };
    UsersComponent.prototype.openForm = function () {
        this.popUp = true;
    };
    UsersComponent.prototype.closeForm = function () {
        this.popUp = false;
    };
    UsersComponent.prototype.ngOnDestroy = function () {
        localStorage.removeItem('selected user');
    };
    __decorate([
        core_1.Input()
    ], UsersComponent.prototype, "editProfile");
    __decorate([
        core_1.Input()
    ], UsersComponent.prototype, "editAttendance");
    __decorate([
        core_1.Input()
    ], UsersComponent.prototype, "user");
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'app-users',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.scss']
        })
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
