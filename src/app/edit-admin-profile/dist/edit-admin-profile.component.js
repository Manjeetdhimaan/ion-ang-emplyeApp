"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditAdminProfileComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var EditAdminProfileComponent = /** @class */ (function () {
    function EditAdminProfileComponent(router, http, apiService, spinner) {
        this.router = router;
        this.http = http;
        this.apiService = apiService;
        this.spinner = spinner;
        this.isLoading = false;
    }
    EditAdminProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.spinner.show();
        this.editAdminProfileForm = new forms_1.FormGroup({
            email: new forms_1.FormControl(this.email),
            password: new forms_1.FormControl(this.password),
            confirmPassword: new forms_1.FormControl(this.confirmPassword)
        });
        var admin = localStorage.getItem('admin');
        if (admin == null) {
            this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
        }
        if (admin !== null) {
            this.isLoading = true;
            var loggedInUser = JSON.parse(admin);
            this.user = loggedInUser;
            this.id = loggedInUser.id;
            delete loggedInUser.password;
            this.http.get("admin").subscribe(function (res) {
                //logged in user
                _this.user = res;
                _this.email = _this.user.email;
                _this.isLoading = false;
                // getting attendance of logged in user
            }, function (error) {
                console.log(error);
                _this.isLoading = false;
            });
        }
    };
    EditAdminProfileComponent.prototype.onUpdateValues = function () {
        var _this = this;
        this.isLoading = true;
        var loggedInUser = localStorage.getItem('admin');
        var credentials = {
            email: this.editAdminProfileForm.value.email,
            password: this.editAdminProfileForm.value.password,
            id: this.id.trim()
        };
        if (!credentials.password) {
            credentials.password = this.user.password;
        }
        if (this.editAdminProfileForm.value.password !== this.editAdminProfileForm.value.confirmPassword) {
            this.isLoading = false;
            sweetalert2_1["default"].fire({ title: '', text: 'Passwords do no match!', icon: 'warning', timer: 1000 });
            return;
        }
        else if (loggedInUser !== null) {
            this.http.post("admin/updateAdminCredentials/" + this.id, credentials).subscribe(function (res) {
                _this.isLoading = false;
                _this.user = res;
                sweetalert2_1["default"].fire({ title: 'Success!', text: 'Data saved succussfully!', icon: 'success', timer: 1000 });
            }, function (error) {
                // Error 
                _this.isLoading = false;
                sweetalert2_1["default"].fire('Error!', error, 'error');
                console.log(error);
            });
        }
    };
    EditAdminProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-edit-admin-profile',
            templateUrl: './edit-admin-profile.component.html',
            styleUrls: ['./edit-admin-profile.component.scss']
        })
    ], EditAdminProfileComponent);
    return EditAdminProfileComponent;
}());
exports.EditAdminProfileComponent = EditAdminProfileComponent;
