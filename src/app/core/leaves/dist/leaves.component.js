"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LeavesComponent = void 0;
var core_1 = require("@angular/core");
var LeavesComponent = /** @class */ (function () {
    function LeavesComponent(http, apiService) {
        this.http = http;
        this.apiService = apiService;
        this.p = 1;
        this.isLoading = false;
    }
    LeavesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var loggedInUser = localStorage.getItem('User');
        if (loggedInUser !== null) {
            var parsedData = JSON.parse(loggedInUser);
            this.id = parsedData["_id"];
            this.http.get("users/" + this.id).subscribe(function (res) {
                //logged in user
                _this.user = res;
                // getting leaves of logged in user
                _this.leaves = _this.user.leaves.reverse();
            }, function (error) {
                console.log(error);
            });
        }
    };
    LeavesComponent.prototype.getCustomCss = function (status) {
        //Logic here;
        if (status == "Approved") {
            return 'success';
        }
        if (status == "Denied") {
            return 'danger';
        }
        return 'warn';
    };
    LeavesComponent = __decorate([
        core_1.Component({
            selector: 'app-leaves',
            templateUrl: './leaves.component.html',
            styleUrls: ['./leaves.component.scss']
        })
    ], LeavesComponent);
    return LeavesComponent;
}());
exports.LeavesComponent = LeavesComponent;
