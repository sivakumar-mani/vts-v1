import { Component, OnInit,ViewChild,TemplateRef,NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { WindowRefService } from '../services/window-ref.service';
import {MatDialog } from '@angular/material/dialog';
import {Router } from '@angular/router';
import { CommonService } from '../../common-methods/services/common.service';
@Component({
  standalone: false,
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css'],
  providers: [WindowRefService]
})
export class PaymentGatewayComponent implements OnInit {
  razerpay: any;
  title = 'PaymentGatWay';
  options: any
  headerText = '';
  bodyText = '';
  paymentkey;
  userData;
  @ViewChild('sucessAlert', { static: true }) sucessAlert!: TemplateRef<any>;
  constructor(private winRef: WindowRefService, private authService: AuthService,private common: CommonService,
     private dialog:MatDialog,private router:Router,private zone:NgZone) { }

  ngOnInit() {
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
      const compAmount=(this.authService.paymentDetails.amount * 100).toString()
      const parsedAmount=parseFloat(compAmount).toFixed(2)
      const totalAmount = parsedAmount.split('.')[0];
    this.options = {
      "key":this.authService.paymentDetails.ApiKey,
       "amount": totalAmount,
      "currency": "INR",
      "name": "DSSI Corp",
      "image": "https://example.com/your_logo",
     // "order_id": val, send for live key payment only
     "prefill": this.authService.paymentDetails.prefill,
      "theme": {
        "color": "#3399cc"
      },
  
      handler: this.paymentHandler.bind(this),
      modal: {
        ondismiss: (() => {
          this.zone.run((res:any) => {
            const paymentid=null
            const reason='User Close The Tab'
            this.UpdatePaymentMethod(paymentid,reason)
            //Payment Tab Close naviagte the url
            this.router.navigate(['dashboard/screening/india'])
     
          })
        })
      }
    };

    // this.options.handler = ((response, error) => {
    // // this.options.response = response;
    // const paymentid=response.razorpay_payment_id
    // if(paymentid!==null){
    //   this.UpdatePaymentMethod(paymentid)
         
    //   console.log(response);
    //   console.log(this.options);      
    // } 
    // });
    // this.options.modal.ondismiss = (() => {
    //   console.log('cancelled');
    // });

    this.razerpay = this.winRef.nativeWindow.Razorpay(this.options);
    this.razerpay.open();
    //this.razerpay.on('payment.failed', function (response){
      //alert(response.error.code);
     // alert(response.error.description);
    //  alert(response.error.source);
     // alert(response.error.step);
     // alert(response.error.reason);
     // alert(response.error.metadata.order_id);
     // alert(response.error.metadata.payment_id);
    //  const reason=response.error.reason
    //  const paymentid=response.error.metadata.payment_id
    //  this.UpdatePaymentMethod(paymentid,reason)
   // })
  }
  Method() {
    this.razerpay = this.winRef.nativeWindow.Razorpay(this.options);
    this.razerpay.open();
  }
  paymentHandler(res: any) {
    this.zone.run(() => {
         const paymentid=res.razorpay_payment_id
           if(paymentid!==null){
             const reason='User Done The Payment'
             this.UpdatePaymentMethod(paymentid,reason)
            //  console.log(res);
           } 
    });
   }
UpdatePaymentMethod(paymentid,reason){
    this.authService.AddUpdatePayment({LoggedId:this.userData.userId,PaymentId:this.authService.paymentDetails.Paymentid,Repaymentid:paymentid
      ,EmailAddress:this.authService.paymentDetails.prefill.email,Reason:reason})
  .subscribe(res=>{
    if(res.orderId!=null &&res.status==='Success'){
    this.alert(res.orderId)
    }
  })
  }
  alert(paymentid: any) {
    this.headerText = 'Sucess';
    this.bodyText = paymentid;
    this.dialog.open(this.sucessAlert, {
      width: '320px',
      disableClose: true
    });
  }
  navigateUrl(){
    this.dialog.closeAll();
    this.router.navigate(['/login'])
  }
  print(){
    const printContent = document.getElementById("componentID");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    }

   
}