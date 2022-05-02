import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  isLoading: boolean = false;
  isEmployee: boolean = false;
  user: any;

// earnings
  basic: number = 0;
  da: number = 0;
  hra: number = 0;
  wa: number = 0;
  ca: number = 0;
  cca: number = 0;
  ma: number = 0;
  SalesIncentive: number = 0;
  LeaveEncashment: number = 0;
  HolidayWages: number = 0;
  SpecialAllowance: number = 0;
  Bonus: number = 0;
  IndividualIncentive: number = 0;
  totalEarning: number = 0;
  // end of earnings
  // deductions
  pf:number=0;
  esi:number=0;
  tds:number=0;
  lop:number=0;
  pt:number=0;
  SPL_Deduction:number=0;
  ewf:number=0;
  cd:number=0;
  totalDeductions: number = 0;
  // end of  deductions
  payrollForm = new FormGroup({
    // earnings
    month: new FormControl(),
    basic: new FormControl(),
    da: new FormControl(),
    hra: new FormControl(),
    wa: new FormControl(),
    ca: new FormControl(),
    cca: new FormControl(),
    ma: new FormControl(),
    SalesIncentive: new FormControl(),
    LeaveEncashment: new FormControl(),
    HolidayWages: new FormControl(),
    SpecialAllowance: new FormControl(),
    Bonus: new FormControl(),
    IndividualIncentive: new FormControl(),
    // end earnings

    // deductions
    pf: new FormControl(),
    esi: new FormControl(),
    tds: new FormControl(),
    lop: new FormControl(),
    pt: new FormControl(),
    SPL_Deduction: new FormControl(),
    ewf: new FormControl(),
    cd: new FormControl(),
  })
  // 
  id: number;
  // total(): number{
  //   return 0
  // };

  constructor(private router: Router,
    private http: HttpClient,
    private apiService: ApiServiceService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.isLoading = true;
    this.activatedRoute.params.subscribe((param: Params) => {
      this.id = param.id
    })

    const admin = localStorage.getItem('admin');
    const loggedInUser = (localStorage.getItem('User'));
    if (admin == null) {
      this.isEmployee = false;
      this.router.navigateByUrl('/adminlogin', { replaceUrl: true });
      this.isLoading = false;
    }
    if (loggedInUser !== null) {
      this.isEmployee = true;
    }
    this.http.get(`${this.apiService.url}/users/${this.id}`).subscribe(res => {
      this.user = res;
      let lastpay = this.user.payroll.reverse();
      if (lastpay.length > 0) {
        lastpay.map((a:any)=>{
          if(!a){
            a = 0;
          }
        })
        // earnings
        this.basic = lastpay[0].basic;
        this.da = lastpay[0].da;
        this.hra = lastpay[0].hra;
        this.wa = lastpay[0].wa;
        this.ca = lastpay[0].ca;
        this.cca = lastpay[0].cca;
        this.ma = lastpay[0].ma;
        this.SalesIncentive = lastpay[0].SalesIncentive;
        this.LeaveEncashment = lastpay[0].LeaveEncashment;
        this.HolidayWages = lastpay[0].HolidayWages;
        this.SpecialAllowance = lastpay[0].SpecialAllowance;
        this.Bonus = lastpay[0].Bonus;
        this.IndividualIncentive = lastpay[0].IndividualIncentive;
        this.totalEarning = lastpay[0].totalEarning
       //  deductions
        this.pf = lastpay[0].pf
        this.esi = lastpay[0].esi
        this.tds = lastpay[0].tds
        this.lop = lastpay[0].lop
        this.pt = lastpay[0].pt
        this.SPL_Deduction = lastpay[0].SPL_Deduction
        this.ewf = lastpay[0].ewf
        this.cd = lastpay[0].cd
        this.totalDeductions = lastpay[0].totalDeductions
        //  this.total = function aa (){
        //      return Number([lastpay[0]].reduce((acc:any, item:any) => {
        //      return acc + (item.basic + item.da);
        //    }, 0));
        //  }
      }
      this.isLoading = false;
    },
      error => {
        console.log(error);
        this.isLoading = false;
      })

    this.payrollForm = new FormGroup({
      month: new FormControl(),
      basic: new FormControl(this.basic),
      da: new FormControl(this.da),
      hra: new FormControl(this.hra),
      wa: new FormControl(this.wa),
      ca: new FormControl(this.ca),
      cca: new FormControl(this.cca),
      ma: new FormControl(this.ma),
      SalesIncentive: new FormControl(this.SalesIncentive),
      LeaveEncashment: new FormControl(this.LeaveEncashment),
      HolidayWages: new FormControl(this.HolidayWages),
      SpecialAllowance: new FormControl(this.SpecialAllowance),
      Bonus: new FormControl(this.Bonus),
      IndividualIncentive: new FormControl(this.IndividualIncentive),

      pf: new FormControl(this.pf),
      esi: new FormControl(this.esi),
      tds: new FormControl(this.tds),
      lop: new FormControl(this.lop),
      pt: new FormControl(this.pt),
      SPL_Deduction: new FormControl(this.SPL_Deduction),
      ewf: new FormControl(this.ewf),
      cd: new FormControl(this.cd),
    })
  }


  onSavePayroll() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe((param: Params) => {
      this.id = param.id
    })
    let checkMonth = ""
    const inputFeilds = document.querySelectorAll("input");
    const validInputs = Array.from(inputFeilds).filter(input => input.value == "");
    let payrolls = {
      month: this.payrollForm.value.month,
      basic: this.payrollForm.value.basic,
      da: this.payrollForm.value.da,
      hra: this.payrollForm.value.hra,
      wa: this.payrollForm.value.wa,
      ca: this.payrollForm.value.ca,
      cca: this.payrollForm.value.cca,
      ma: this.payrollForm.value.ma,
      SalesIncentive: this.payrollForm.value.SalesIncentive,
      LeaveEncashment: this.payrollForm.value.LeaveEncashment,
      HolidayWages: this.payrollForm.value.HolidayWages,
      SpecialAllowance: this.payrollForm.value.SpecialAllowance,
      Bonus: this.payrollForm.value.Bonus,
      IndividualIncentive: this.payrollForm.value.IndividualIncentive,
      totalEarning: this.onGetTotalEarning(),

      pf: this.payrollForm.value.pf,
      esi: this.payrollForm.value.esi,
      tds: this.payrollForm.value.tds,
      lop: this.payrollForm.value.lop,
      pt: this.payrollForm.value.pt,
      SPL_Deduction: this.payrollForm.value.SPL_Deduction,
      ewf: this.payrollForm.value.ewf,
      cd: this.payrollForm.value.cd,
      totalDeductions: this.onGetTotalDeductions()
    }
    this.user.payroll.map((a: any) => {
      if (a.month == payrolls.month) {
        checkMonth = "checked";
      }

    })
    if (checkMonth == "checked") {
      Swal.fire('Error!', `${this.user.fullname}'s salary slip already created for ${payrolls.month}`, 'error')
     
      this.isLoading = false;
      return
    }
    if (validInputs.length > 0) {
      Swal.fire('Error!', 'Please select a month for payment', 'error');
      this.isLoading = false;
      return;
    }
    this.http.post(`${this.apiService.url}/users/${this.id}/salary`, payrolls).subscribe((res: any) => {
      this.user.payroll = res.payroll;
      if (checkMonth !== "checked") {
        this.isLoading = false;
        Swal.fire('Success!', `${res.fullname}'s salary slip created successfully for ${payrolls.month}`, 'success');
        checkMonth = "checked";
      }
    }, error => {
      checkMonth = "checked";
      this.isLoading = false;
      console.log(error)
      Swal.fire('Error!', error, 'error')
    })
  }
  onGetTotalEarning() {
    return (this.payrollForm.value.basic +
      this.payrollForm.value.da +
      this.payrollForm.value.hra +
      this.payrollForm.value.wa +
      this.payrollForm.value.ca +
      this.payrollForm.value.cca +
      this.payrollForm.value.ma +
      this.payrollForm.value.SalesIncentive +
      this.payrollForm.value.LeaveEncashment +
      this.payrollForm.value.HolidayWages +
      this.payrollForm.value.SpecialAllowance +
      this.payrollForm.value.Bonus +
      this.payrollForm.value.IndividualIncentive)
  }

  onGetTotalDeductions(){
    return (this.payrollForm.value.pf +
      this.payrollForm.value.esi +
      this.payrollForm.value.tds +
      this.payrollForm.value.lop +
      this.payrollForm.value.pt +
      this.payrollForm.value.SPL_Deduction +
      this.payrollForm.value.ewf +
      this.payrollForm.value.cd)
  }
}
