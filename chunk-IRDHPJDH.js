import{a as Y,b as ee,c as d,d as N,e as D,f as T,h as y,j as V,k as L,l as O,m as te,o as U,p as G}from"./chunk-PCAN3YLM.js";import{$ as J,E as r,Ea as X,Ga as A,Ha as q,Ia as H,J as p,Ja as E,Ka as P,L as i,N as a,O as l,P as c,Q as g,R as f,T as R,U as h,Y as s,_ as x,ea as K,g as k,ka as Q,o as I,qa as W,r as m,ra as C,s as b,t as F,ua as M}from"./chunk-ALU2VKCJ.js";import{f as S}from"./chunk-CMD3HYZE.js";function le(t,n){t&1&&(a(0,"span",6),s(1,"*"),l())}function se(t,n){if(t&1&&(a(0,"p",8),s(1),l()),t&2){let e=h(3);r(),x(" ",e.label," is required ")}}function me(t,n){if(t&1&&(a(0,"p",8),s(1),l()),t&2){let e=h(3);r(),x(" ",e.label," is invalid ")}}function pe(t,n){if(t&1&&(a(0,"p",8),s(1),l()),t&2){let e=h(3);r(),x(" ",e.patternMsg||e.label," is invalid ")}}function ce(t,n){if(t&1&&(a(0,"p",8),s(1),l()),t&2){let e=h(3);r(),J(" ",e.label," minimum length is ",e.minLength," ")}}function de(t,n){if(t&1&&(g(0),p(1,se,2,1,"p",7)(2,me,2,1,"p",7)(3,pe,2,1,"p",7)(4,ce,2,2,"p",7),f()),t&2){let e=h(2);r(),i("ngIf",e.required&&e.checkFormControlError(e.control,"required")),r(),i("ngIf",e.type=="email"&&e.checkFormControlError(e.control,"email")),r(),i("ngIf",e.patternValidator&&e.checkFormControlError(e.control,"pattern")),r(),i("ngIf",e.minLength>0&&e.checkFormControlError(e.control,"minlength"))}}function ue(t,n){if(t&1&&(a(0,"div",1)(1,"label",2),s(2),p(3,le,2,0,"span",3),l(),c(4,"input",4),p(5,de,5,4,"ng-container",5),l()),t&2){let e=h();r(),i("for",e.inputId),r(),x(" ",e.label," "),r(),i("ngIf",e.required),r(),i("id",e.inputId)("placeholder",e.placeholder)("type",e.type)("id",e.inputId)("placeholder",e.placeholder)("formControl",e.control)("min",e.type==="number"?e.minValue:null)("max",e.type==="number"?e.maxValue:null),r(),i("ngIf",e.control.touched)}}var v=class t{cdr=m(Q);label="";control;type="text";placeholder="";required=!1;patternValidator=!1;pattern="";minLength=-1;inputMode="text";minValue=null;maxValue=null;inputId=`input-${Math.random().toString(36).substring(2,15)}`;isPasswordField=!1;showPassword=!1;patternMsg="";ngOnInit(){this.handlePasswordInput()}ngAfterContentChecked(){this.cdr.detectChanges()}checkFormControlError(n,e){return(n.touched&&n.hasError(e))??!0}handlePasswordInput(){this.isPasswordField=this.type==="password"}toggleShowPassword(){this.showPassword=!this.showPassword,this.type=this.showPassword?"text":"password"}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=b({type:t,selectors:[["app-input"]],inputs:{label:"label",control:"control",type:"type",placeholder:"placeholder",required:"required",patternValidator:"patternValidator",pattern:"pattern",minLength:"minLength",inputMode:"inputMode",minValue:"minValue",maxValue:"maxValue",patternMsg:"patternMsg"},standalone:!0,features:[K],decls:1,vars:1,consts:[["class","form-control",4,"ngIf"],[1,"form-control"],[1,"block","mb-2","text-sm","font-medium","text-gray-900","dark:text-white",3,"for"],["class","text-red-600",4,"ngIf"],["type","text",1,"bg-gray-50","outline-none","border","border-gray-300","text-gray-900","text-sm","rounded-lg","focus:ring-blue-500","focus:border-blue-500","block","w-full","p-2.5","dark:bg-gray-700","dark:border-gray-600","dark:placeholder-gray-400","dark:text-white","dark:focus:ring-blue-500","dark:focus:border-blue-500",3,"id","placeholder","type","formControl","min","max"],[4,"ngIf"],[1,"text-red-600"],["class","form-control-error",4,"ngIf"],[1,"form-control-error"]],template:function(e,o){e&1&&p(0,ue,6,12,"div",0),e&2&&i("ngIf",o.control)},dependencies:[U,ee,N,L,M,C],styles:[".form-control[_ngcontent-%COMP%]{margin-bottom:.75rem;width:100%}.form-control[_ngcontent-%COMP%]::placeholder{--tw-text-opacity: 1;color:rgb(22 163 74 / var(--tw-text-opacity, 1))}.form-control[_ngcontent-%COMP%]   .form-control-label[_ngcontent-%COMP%]{text-transform:capitalize;--tw-text-opacity: 1;color:rgb(37 99 235 / var(--tw-text-opacity, 1))}.form-control[_ngcontent-%COMP%]   .form-control-error[_ngcontent-%COMP%]{margin-top:.25rem;font-size:.875rem;line-height:1.25rem;font-weight:500;text-transform:capitalize;--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity, 1))}"]})};function fe(t,n){t&1&&(g(0),c(1,"i",18),s(2," login "),f())}function he(t,n){t&1&&(g(0),c(1,"i",19),f())}var z=class t{route=m(X);router=m(A);sweetAlertService=m(E);userStateService=m(P);authApiService=m(G);returnUrl;loginForm=new T({userName:new y(null,[d.required]),password:new y(null,[d.required])});loading=!1;rememberMeControl=new y(!1);ngOnInit(){this.returnUrl=this.route.snapshot.queryParams.returnUrl||"/"}login(){return S(this,null,function*(){if(this.loginForm.invalid){this.sweetAlertService.showToast({icon:"warning",title:"Username and Password are required"});return}let n=this.loginForm.value,e=new FormData;for(let u in n)n.hasOwnProperty(u)&&e.append(u,n[u]);this.loading=!0;let o=yield k(this.authApiService.login(e)),{isSuccess:w,token:$}=o;if(!w||!$.length){this.loading=!1,this.sweetAlertService.showAlert({icon:"info",title:"Username or Password Incorrect",text:"please try carefully"});return}let _=this.rememberMeControl.value??!1;this.userStateService.setUser(o,_),this.loading=!1,this.sweetAlertService.showToast({icon:"success",title:"Logged Successfully"}),this.router.navigate([this.returnUrl])})}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=b({type:t,selectors:[["app-login"]],decls:23,vars:9,consts:[[1,"bg-gray-50","dark:bg-gray-900"],[1,"flex","flex-col","items-center","justify-center","px-6","py-8","mx-auto","md:h-screen","lg:py-0"],[1,"w-full","bg-white","rounded-lg","shadow","dark:border","md:mt-0","sm:max-w-md","xl:p-0","dark:bg-gray-800","dark:border-gray-700"],[1,"p-6","space-y-4","md:space-y-6","sm:p-8"],[1,"text-xl","font-bold","leading-tight","tracking-tight","text-gray-900","md:text-2xl","dark:text-white"],[1,"space-y-4","md:space-y-6",3,"formGroup"],["label","Username","type","text",3,"control","required"],["label","Password","type","password",3,"control","required"],[1,"flex","items-center","justify-between"],[1,"flex","items-start"],[1,"flex","items-center","h-5"],["id","remember","aria-describedby","remember","type","checkbox","required","",1,"w-4","h-4","border","border-gray-300","rounded","bg-gray-50","focus:ring-3","focus:ring-blue-300","dark:bg-gray-700","dark:border-gray-600","dark:focus:ring-blue-600","dark:ring-offset-gray-800",3,"formControl"],[1,"ml-3","text-sm"],["for","remember",1,"text-gray-500","dark:text-gray-300"],["type","submit",1,"btn-blue","w-full",3,"click","disabled"],[4,"ngIf"],[1,"text-sm","font-light","text-gray-500","dark:text-gray-400"],["routerLink","/auth/register",1,"font-medium","text-blue-600","hover:underline","dark:text-blue-500"],[1,"fa-solid","fa-right-to-bracket"],[1,"fa-solid","fa-spinner","animate-spin","text-xl"]],template:function(e,o){e&1&&(a(0,"section",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h1",4),s(5," Login to your account "),l(),a(6,"form",5),c(7,"app-input",6)(8,"app-input",7),a(9,"div",8)(10,"div",9)(11,"div",10),c(12,"input",11),l(),a(13,"div",12)(14,"label",13),s(15,"Remember me"),l()()()(),a(16,"button",14),R("click",function(){return o.login()}),p(17,fe,3,0,"ng-container",15)(18,he,2,0,"ng-container",15),l(),a(19,"p",16),s(20," Don\u2019t have an account yet? "),a(21,"a",17),s(22,"Register Now"),l()()()()()()()),e&2&&(r(6),i("formGroup",o.loginForm),r(),i("control",o.loginForm.get("userName"))("required",!0),r(),i("control",o.loginForm.get("password"))("required",!0),r(4),i("formControl",o.rememberMeControl),r(4),i("disabled",o.loading),r(),i("ngIf",!o.loading),r(),i("ngIf",o.loading))},dependencies:[C,q,v,V,Y,N,D,te,L,O]})};function ye(t,n){if(t&1&&(a(0,"p",15),s(1),l()),t&2){let e=n.$implicit;r(),x(" ",e,"")}}function ve(t,n){if(t&1&&(g(0),a(1,"div",13),p(2,ye,2,1,"p",14),l(),f()),t&2){let e=h();r(2),i("ngForOf",e.errorMsgs)}}function xe(t,n){t&1&&(g(0),c(1,"i",16),s(2," Register "),f())}function be(t,n){t&1&&(g(0),c(1,"i",17),f())}var B=class t{router=m(A);sweetAlertService=m(E);userStateService=m(P);authApiService=m(G);passwordRegex=/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;invalidPasswordPatternMsg="Password must contain at least one uppercase letter (A-Z) and one special character (e.g., !, @, #, etc.).";registerForm=new T({userName:new y(null,[d.required]),email:new y(null,[d.required,d.email]),password:new y(null,[d.required,d.minLength(6),d.pattern(this.passwordRegex)])});errorMsgs=[];loading=!1;register(){return S(this,null,function*(){if(this.registerForm.invalid){this.sweetAlertService.showToast({icon:"warning",title:"All inputs are required"});return}let n=this.registerForm.value,e=new FormData;for(let u in n)n.hasOwnProperty(u)&&e.append(u,n[u]);this.loading=!0;let o=yield k(this.authApiService.register(e)),{isSuccess:w,token:$,errors:_}=o;if(!w||!$.length){_&&_.length&&(this.errorMsgs=_.map(u=>u.description)),this.loading=!1;return}this.userStateService.setUser(o,!1),this.loading=!1,this.router.navigate(["/"]),this.sweetAlertService.showToast({icon:"success",title:"Registered Successfully"})})}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=b({type:t,selectors:[["app-register"]],decls:18,vars:14,consts:[[1,"bg-gray-50","dark:bg-gray-900"],[1,"flex","flex-col","items-center","justify-center","px-6","py-8","mx-auto","md:h-screen","lg:py-0"],[1,"w-full","bg-white","rounded-lg","shadow","dark:border","md:mt-0","sm:max-w-md","xl:p-0","dark:bg-gray-800","dark:border-gray-700"],[1,"p-6","space-y-4","md:space-y-6","sm:p-8"],[1,"text-xl","font-bold","leading-tight","tracking-tight","text-gray-900","md:text-2xl","dark:text-white"],[1,"space-y-4","md:space-y-6",3,"formGroup"],["label","Username","type","text",3,"control","required"],["label","Email","type","email","inputMode","email",3,"control","required"],["label","Password","type","password",3,"control","required","patternValidator","pattern","patternMsg"],[4,"ngIf"],["type","submit",1,"btn-blue","w-full",3,"click","disabled"],[1,"text-sm","font-light","text-gray-500","dark:text-gray-400"],["routerLink","/auth/login",1,"font-medium","text-blue-600","hover:underline","dark:text-blue-500","capitalize"],[1,"errors"],["class","text-red-500 mt-1 font-medium text-sm capitalize",4,"ngFor","ngForOf"],[1,"text-red-500","mt-1","font-medium","text-sm","capitalize"],[1,"fa-solid","fa-right-to-bracket"],[1,"fa-solid","fa-spinner","animate-spin","text-xl"]],template:function(e,o){e&1&&(a(0,"section",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h1",4),s(5," Register an account "),l(),a(6,"form",5),c(7,"app-input",6)(8,"app-input",7)(9,"app-input",8),p(10,ve,3,1,"ng-container",9),a(11,"button",10),R("click",function(){return o.register()}),p(12,xe,3,0,"ng-container",9)(13,be,2,0,"ng-container",9),l(),a(14,"p",11),s(15," Already have an account? "),a(16,"a",12),s(17,"login Here"),l()()()()()()()),e&2&&(r(6),i("formGroup",o.registerForm),r(),i("control",o.registerForm.get("userName"))("required",!0),r(),i("control",o.registerForm.get("email"))("required",!0),r(),i("control",o.registerForm.get("password"))("required",!0)("patternValidator",!0)("pattern",o.passwordRegex)("patternMsg",o.invalidPasswordPatternMsg),r(),i("ngIf",o.errorMsgs&&o.errorMsgs.length),r(),i("disabled",o.loading),r(),i("ngIf",!o.loading),r(),i("ngIf",o.loading))},dependencies:[W,C,q,v,V,D,O]})};var Ce=[{path:"",redirectTo:"login",pathMatch:"full"},{path:"login",component:z},{path:"register",component:B}],Z=class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=F({type:t});static \u0275inj=I({imports:[H.forChild(Ce),H]})};var ae=class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=F({type:t});static \u0275inj=I({imports:[M,Z,v,U]})};export{ae as AuthModule};
