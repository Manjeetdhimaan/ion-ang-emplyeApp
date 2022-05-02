"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(http, spinner, router, apiService) {
        this.http = http;
        this.spinner = spinner;
        this.router = router;
        this.apiService = apiService;
        this.service = "none";
        this.isServiceProvider = false;
        this.isLoading = false;
        this.layout = 'register';
        this.submitted = false;
        this.adminForm = new forms_1.FormGroup({
            email: new forms_1.FormControl(''),
            password: new forms_1.FormControl('')
        });
        this.loginForm = new forms_1.FormGroup({
            email: new forms_1.FormControl(''),
            password: new forms_1.FormControl('')
        });
        this.registerForm = new forms_1.FormGroup({
            fullname: new forms_1.FormControl(),
            email: new forms_1.FormControl(),
            password: new forms_1.FormControl(),
            phone: new forms_1.FormControl(),
            pic: new forms_1.FormControl(),
            service: new forms_1.FormControl(),
            bio: new forms_1.FormControl(),
            joindate: new forms_1.FormControl()
        });
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.spinner.show();
    };
    RegisterComponent.prototype.adminlogin = function () {
        var _this = this;
        this.isLoading = true;
        var credentials = {
            email: this.adminForm.value.email,
            password: this.adminForm.value.password
        };
        this.http.post("admin/adminLogin", credentials).subscribe(function (res) {
            _this.isLoading = false;
            localStorage.setItem('admin', JSON.stringify(res));
            localStorage.removeItem('User');
            _this.router.navigateByUrl('/allusers', { replaceUrl: true });
        }, function (error) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire('Error!', error.error.error, 'error');
        });
    };
    RegisterComponent.prototype.userlogin = function () {
        var _this = this;
        this.isLoading = true;
        var credentials = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };
        this.http.post("users/login", credentials).subscribe(function (res) {
            _this.isLoading = false;
            localStorage.setItem('User', JSON.stringify(res));
            var user = localStorage.getItem('User');
            if (user) {
                var parsedData = JSON.parse(user);
                _this.loggedInUser = parsedData;
                var a = parsedData.fullname.toLowerCase().split(' ');
                _this.paramName = a.join('-');
            }
            localStorage.removeItem('admin');
            _this.router.navigate(['profile', _this.paramName], { replaceUrl: true });
        }, function (error) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire('Error!', error.error.error, 'error');
        });
    };
    RegisterComponent.prototype.onRegister = function () {
        var _this = this;
        this.isLoading = true;
        var user = {
            fullname: this.registerForm.value.fullname,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            phone: this.registerForm.value.phone,
            pic: this.registerForm.value.pic,
            service: this.registerForm.value.service,
            bio: this.registerForm.value.bio,
            joindate: this.registerForm.value.joindate,
            isServiceProvider: this.isServiceProvider
        };
        if (user.email == '' || !user.email) {
            sweetalert2_1["default"].fire('Registeration Failed!', 'Email required', 'error');
            this.isLoading = false;
        }
        else {
            this.http.post("users/register", user)
                .subscribe(function (res) {
                _this.isLoading = false;
                localStorage.setItem('User', JSON.stringify(res));
                // Success
                sweetalert2_1["default"].fire('Registeration successfull!', 'Login Now!', 'success');
                _this.router.navigateByUrl('userlogin');
            }, function (error) {
                _this.isLoading = false;
                sweetalert2_1["default"].fire('Registeration Failed!', error.error.error, 'error');
            });
        }
    };
    RegisterComponent.prototype.onServiceSelect = function (event) {
        var response = event.detail.value;
        if (response == "no" || response == "No" || response == "NO") {
            this.isServiceProvider = false;
        }
        else {
            this.isServiceProvider = true;
        }
    };
    __decorate([
        core_1.Input()
    ], RegisterComponent.prototype, "layout");
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-register',
            templateUrl: './register.component.html',
            styleUrls: ['./register.component.scss']
        })
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
