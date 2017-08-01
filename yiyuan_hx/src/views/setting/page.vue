<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';
//    import page from './page'

    export default {
        data(){
            return {
                title:'设置',
                is_low_version:true,
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                arrow_item_src:appConfig.getImagesAddress()+'icon_setting_item_right.png',
                goShadow:false,
                logout_click_flag:false, //退出 防止连击
                is_checked:true,
                version_code:'',
            };
        },

        mounted(){
            this.getUpgrade() ;
        },

        methods: {
            gosuggestion:function () {
                weexModules.gotoPage(appConfig.getJsServerAddress()+'suggestion.js')
            },
            loginOut:function () {
                if (!this.logout_click_flag) {
                    this.logout_click_flag = true;

                    weexModules.httpGet(appConfig.getApiServerAddress() + '/api/users/logout').then((res) => {
//                        if (res.error_code == -400) {
//                            weexModules.closePage() ;
//                        } else {
                            weexModules.updateSid(res.sid).then(res=>{
                                console.log("设置登录状态");
                                weexModules.setLoginStatus(false) ;
                            });
                            weexModules.openAppFunction('app://users/login_success',{user_id:""});
                            weexModules.closePage() ;
                            weexModules.toast('退出成功');
//                        }
                        weexModules.openAppFunction('app://main/home') ;

                        this.logout_click_flag = false;
                    });
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            onchange () {

                if ( this.is_checked ) {

                    this.goShadow = true ;


                }else {

                    this.goConfirm() ;
                }

                this.is_checked = !this.is_checked ;


            },

            goCancel () {

                this.is_checked = true ;

                this.goShadow = false ;
            },
            
            goConfirm () {

                this.goShadow = false ;

                var self = this ;

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/software/setting',{push_status:self.is_checked}).then( (ref)=>{

                    if( ref.error_code == 0){

                    }else {

                        self.is_checked = !self.is_checked ;

                        weexModules.toast('修改失败') ;
                    }
                }) ;
            },

            getUpgrade:function () {

                var self = this;

                weexModules.openAppFunction('app://software/info').then(function(json){

                    self.version_code = json.version_name ;

                }) ;

            },

            checkVersion:function () {
                weexModules.openAppFunction('app://soft_versions/upgrade') ;
            }

        }
    }
</script>