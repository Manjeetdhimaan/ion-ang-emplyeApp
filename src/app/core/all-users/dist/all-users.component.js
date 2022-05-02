"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AllUsersComponent = void 0;
var core_1 = require("@angular/core");
var AllUsersComponent = /** @class */ (function () {
    function AllUsersComponent(router, http, apiService, userService, spinner) {
        this.router = router;
        this.http = http;
        this.apiService = apiService;
        this.userService = userService;
        this.spinner = spinner;
        this.isEmployee = false;
        this.leaveArray = [];
        this.p = 1;
        this.isLoading = false;
    }
    AllUsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.spinner.show();
        this.isLoading = true;
        var admin = localStorage.getItem('admin');
        if (admin == null) {
            this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
            this.isLoading = false;
        }
        else {
            this.http.get("users").subscribe(function (res) {
                _this.users = res;
                _this.users.map(function (a) {
                    _this.leaveArray.push(a.leaves);
                });
                _this.isLoading = false;
                // this.originalServiceProvider = res;
            }, function (error) {
                console.log(error);
                _this.isLoading = false;
            });
        }
    };
    AllUsersComponent.prototype.onSelectUser = function (user) {
        this.userService.user = user;
        this.selectedUser = user;
        var a = this.selectedUser.fullname.toLowerCase().split(' ');
        var b = a.join('-');
        localStorage.setItem('selected user', JSON.stringify(this.selectedUser));
        this.router.navigate(['/', b]);
    };
    AllUsersComponent = __decorate([
        core_1.Component({
            selector: 'app-all-users',
            templateUrl: './all-users.component.html',
            styleUrls: ['./all-users.component.scss']
        })
    ], AllUsersComponent);
    return AllUsersComponent;
}());
exports.AllUsersComponent = AllUsersComponent;
