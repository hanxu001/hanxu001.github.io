<style src="./style.css" scoped></style>
<template src="./template.html"></template>

<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull,startsWith,isPhoneNumber, isAuthCode} from 'utils/Utils';
//    import page from './page'

    var timer = null;
    export default {
        data(){
            return {
                title: '绑定手机',
                image_top:appConfig.getImagesAddress()+'icon_bind.png',
                image_phone:appConfig.getImagesAddress()+'image_login_phone.png',
                image_code:appConfig.getImagesAddress()+'image_login_code.png',
                mobile:'',
                code:'',
                auth_time: 0, //30s 倒计时
                time_end_flag: true,
                auth_text: '获取验证码',
                type:'',
                isShow:true,
                HEIGHT:370,
            };
        },

        created(){
            weexModules.setVue(this);

            var  self = this;
            var data = weexModules.getParams();
            this.type = data.type;
            weexModules.toast(this.product_id) ;
            if (!isNull(this.type)){
                self.isShow = false ;
                self.HEIGHT = 0 ;
            }else {
                self.isShow = true ;
                self.HEIGHT = 370 ;
            }
        },

        mounted(){

        },

        methods: {

            rightBarClick:function () {
                weexModules.closePage();
            },

            input:function (id,e) {
                if (id == 1){
                    this.mobile = e.value ;
                }else if (id == 2){
                    this.code = e.value ;
                }
            },
            getAuthCode:function () {
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
            goBind:function () {
                if (!isPhoneNumber(this.mobile)) {
                    weexModules.toast("请输入正确的手机号码");
                    return;
                }

                if (!isAuthCode(this.code)) {
                    weexModules.toast("请输入正确验证码");
                    return;
                }

                weexModules.httpPost(appConfig.getApiServerAddress()+'/api/users/bind_mobile',{
                    mobile: this.mobile,
                    auth_code: this.code,
                }).then( res => {

                    if ( res.error_code == 0 ){

                        weexModules.toast('绑定成功') ;

                        weexModules.closePage() ;

                    }else {
                        weexModules.toast(res.error_reason) ;
                    }
                }) ;
            }
        }
    }
</script>