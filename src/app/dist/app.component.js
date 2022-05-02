"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var operators_1 = require("rxjs/operators");
var AppComponent = /** @class */ (function () {
    function AppComponent(titleService, router, activatedRoute, userService) {
        this.titleService = titleService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.userService = userService;
        this.title = 'employeeManagement';
        this.tab1 = 'FilmsPage';
        this.tab2 = 'PeoplePage';
        this.tab3 = 'PlanetsPage';
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var userName = '';
        var appTitle = this.titleService.getTitle();
        this.router
            .events.pipe(operators_1.filter(function (event) { return event instanceof router_1.NavigationEnd; }), operators_1.map(function () {
            var user = _this.userService.getSelectedUser();
            var child = _this.activatedRoute.firstChild;
            if (child === null || child === void 0 ? void 0 : child.snapshot.data['title']) {
                child.snapshot.data['title'] = userName + ' - EmployeeManagment';
                return child.snapshot.data['title'];
            }
            return appTitle;
        })).subscribe(function (ttl) {
            _this.titleService.setTitle(ttl);
        });
    };
    AppComponent.prototype.ngDoCheck = function () {
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
