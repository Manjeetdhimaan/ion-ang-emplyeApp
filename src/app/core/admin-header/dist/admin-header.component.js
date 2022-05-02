"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminHeaderComponent = void 0;
var core_1 = require("@angular/core");
var AdminHeaderComponent = /** @class */ (function () {
    function AdminHeaderComponent(apiService, router, http) {
        this.apiService = apiService;
        this.router = router;
        this.http = http;
        this.leaveArray = [];
        this.counter = 0;
    }
    AdminHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        var admin = localStorage.getItem('admin');
        if (admin == null) {
            this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
        }
        else {
            this.http.get("users").subscribe(function (res) {
                _this.users = res;
                _this.users.map(function (a) {
                    _this.leaveArray.push(a.leaves);
                });
                [res].map(function (a) {
                    a.map(function (b) {
                        b.leaves.map(function (c) {
                            if (c.status == "Pending") {
                                _this.counter++;
                            }
                        });
                    });
                });
                // this.originalServiceProvider = res;
            }, function (error) {
                console.log(error);
            });
        }
    };
    AdminHeaderComponent.prototype.ngDoCheck = function () {
    };
    AdminHeaderComponent.prototype.adminLogout = function () {
        this.apiService.adminLogout();
    };
    AdminHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-header',
            templateUrl: './admin-header.component.html',
            styleUrls: ['./admin-header.component.scss']
        })
    ], AdminHeaderComponent);
    return AdminHeaderComponent;
}());
exports.AdminHeaderComponent = AdminHeaderComponent;
