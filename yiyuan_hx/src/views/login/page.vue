<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, isPhoneNumber, isAuthCode} from 'utils/Utils';

    var timer = null;
    export default {
        data(){
            return {
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                icon_iphone_src:appConfig.getImagesAddress() + 'image_login_phone.png' ,
                icon_code_src:appConfig.getImagesAddress() + 'image_login_code.png',
                tabItems: [
                    {
                        index: 0,
                        title: "微信",
                        image: appConfig.getImagesAddress() + 'icon_logo_weixin.png',
                    },
                    {
                        index: 1,
                        title: "QQ",
                        image: appConfig.getImagesAddress() + 'icon_logo_qq.png',
                    },
                ],
                title: '登录',
                one_show: 'hidden',
                mobile: '',
                auth_code: '',
                auth_time: 0, //30s 倒计时
                time_end_flag: true,
                auth_text: '获取验证码',
                is_low_version: true,
                agree_toggle:true,
                isIos:false,
            };
        },

        mounted(){
        },

        methods: {

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            login() {

                var self = this ;
                if (!isPhoneNumber(this.mobile)) {
                    weexModules.toast('手机号输入错误');
                    return;
                }
                if (!isAuthCode(this.auth_code)) {
                    weexModules.toast('验证码输入错误');
                    return;
                }
                if(!this.agree_toggle){
                    weexModules.toast('请先同意协议');
                    //self.login_click_flag = false;
                    return;
                }
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/users/login', {
                    sms_token: this.sms_token, auth_code: this.auth_code, mobile: this.mobile
                }).then(res => {
                        if (res.error_code >= 0) {
                            weexModules.toast('登录成功');

                            if (res.hasOwnProperty('sid')){
                                weexModules.updateSid(res.sid) ;
                                weexModules.setLoginStatus(true) ;
                            }
                            //weexModules.toast(res.id) ;
                            self.success(res.id) ;
                            weexModules.closePage() ;

                        } else {
                            weexModules.toast(res.error_reason)
                        }
                });
            },
            getAuthCode() {
                if (!isPhoneNumber(this.mobile)) {
                    weexModules.toast("请输入正确的手机号码");
                    return;
                }
                if (this.auth_time > 0) {
                    return;
                }
                this.auth_time = 60;
                weexModules.httpPost(appConfig.getApiServerAddress() + "/api/users/send_auth_code", {mobile: this.mobile}).then(res => {
                    if (res.hasOwnProperty('error_code')) {
                        if (res.error_code >= 0) {
                            this.sms_token = res.sms_token;
                            weexModules.toast('验证码获取成功');
                        } else {
                            if (timer != null) {
                                clearInterval(timer);
                            }
                            this.auth_time = 0;
                            this.auth_text = "获取验证码";
                            weexModules.toast(res.error_reason);
                        }
                    }
                });
                timer = setInterval(res => {
                    this.auth_time--;
                    this.auth_text = this.auth_time >= 10 ? this.auth_time + 's' : '0' + this.auth_time + 's';
                    if (this.auth_time <= 0) {
                        if (timer != null) {
                            clearInterval(timer);
                            this.auth_text = "获取验证码";
                        }
                    }
                }, 1000);
            },
            mobileInput(e) {
                this.mobile = e.value;
            },
            authInput(e){
                this.auth_code = e.value;
            },
            thirdLogin:function(index){

                if(!this.agree_toggle){
                    weexModules.toast('请先同意协议');
                    //self.login_click_flag = false;
                    return;
                }
                var self = this ;

                if (index == 0){

                    // 微信登录
                    weexModules.openAppFunction('app://login/wx').then(res => {
                        if (res.status>=0&&res.hasOwnProperty('sid')){
                            weexModules.toast('微信登录成功');
                            weexModules.updateSid(res.sid).then(res=>{
                                weexModules.setLoginStatus(true) ;
                            });

                            self.success(res.user_id);

                            weexModules.closePage() ;

                            if(res.hasOwnProperty('mobile')&&isNull(res.mobile)){
//                                weexModules.gotoPage(appConfig.getJsServerAddress()+"bound-phone-newuser.js");
                            } else if (res.hasOwnProperty('mobile')){
                                weexModules.closePage() ;
                            } else {
                                self.checkThirdMobile(flag => {
                                    if (flag) {
                                        weexModules.closePage() ;
                                    } else {
//                                        weexModules.gotoPage(appConfig.getJsServerAddress()+"bound-phone-newuser.js");
                                    }
                                });
                            }
                        }else {
                            weexModules.toast('登录失败') ;
                        }
                    }) ;
                }else {

                    // QQ登录
                    weexModules.openAppFunction('app://login/qq').then( res => {
                        if (res.status>=0&&res.hasOwnProperty('sid')){
                            weexModules.toast('QQ登录成功');
                            weexModules.updateSid(res.sid).then(res=>{
                                weexModules.setLoginStatus(true) ;
                            });
                            weexModules.closePage() ;

                            self.success(res.user_id);
                            if(res.hasOwnProperty('mobile')&&isNull(res.mobile)){

//                                weexModules.gotoPage(appConfig.getJsServerAddress()+"bound-phone-newuser.js");
                            } else if (res.hasOwnProperty('mobile')){

                                weexModules.closePage() ;
                            } else {

                                self.checkThirdMobile(flag => {
                                    if (flag) {
                                        weexModules.closePage() ;
                                    } else {
//                                        weexModules.gotoPage(appConfig.getJsServerAddress()+"bound-phone-newuser.js");
                                    }
                                });
                            }
                        }else {
                            weexModules.toast('登录失败') ;
                        }
                    }) ;
                }
            },

            agree_toggleClick:function () {
                this.agree_toggle=!this.agree_toggle;
            },
            success:function (userId) {

                weexModules.openAppFunction('app://users/login_success',{user_id:userId}).then(res => {
                    this.login_click_flag = false ;
                }) ;
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/software/activities').then(response => {

                    if(response.first_register){
                        weexModules.openAppFunction("app://dialog/get_red_envelope");
                    }
                })
            },
            checkThirdMobile:function (callback) {

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users').then(response=>{
                    if(response.error_code < 0 ) {
                        return;
                    }
                    if(isNull(response.mobile)){
                        callback(false);
                    } else {
                        callback(true);
                    }
                }) ;

            },
            gotoService_agreement:function () {
                weexModules.gotoPage(appConfig.getJsServerAddress()+"service_agreement.js");
            }

        }
    }
</script>