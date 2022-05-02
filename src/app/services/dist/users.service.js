"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersService = void 0;
var core_1 = require("@angular/core");
var UsersService = /** @class */ (function () {
    function UsersService(http, apiService) {
        var _this = this;
        this.http = http;
        this.apiService = apiService;
        this.leaveArray = [];
        this.http.get("users").subscribe(function (res) {
            _this.users = res;
            [res].map(function (a) {
                _this.leaveArray.push(a.leaves);
            });
            // console.log(this.leaveArray) 
            // this.originalServiceProvider = res;
        }, function (error) {
            console.log(error);
        });
    }
    UsersService.prototype.getSelectedUser = function () {
        var user = localStorage.getItem('selected user');
        var parsedData;
        if (user) {
            parsedData = JSON.parse(user);
        }
        if (!this.user) {
            return parsedData;
        }
        else {
            return this.user;
        }
    };
    UsersService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
