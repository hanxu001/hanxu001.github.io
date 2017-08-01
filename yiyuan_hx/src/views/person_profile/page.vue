<style src="./style.css" scoped></style>
<template src="./template.html"></template>

<script>
    import app from 'utils/AppConfig';
    import {getUrlJoinParams, parseUrlParams, isNull} from 'utils/Utils'
    import weexModules from 'utils/WeexModules'

    var modal = weex.requireModule('modal')
    var navigator = weex.requireModule('navigator')
    var event = weex.requireModule('event')
    var photograph = weex.requireModule('PhotographModule')

    export default {
        data (){
            return {
                loadingImg: 'http://test.365yf.cc/hybrid/yiyuan/images/header_anime.gif',
                leftImageSrc: app.getImagesAddress() + 'common_icon_title_back.png',
                title: '个人资料',
                css_male: 'sextext_unselect',
                css_girl: 'sextext_select',
                user:{},
                username:'',
                refreshDisplay:'hide',
                loading_display:'hide',
                loading_visiable:true,
                page:1,
                per_page:20,
                total_page:0,
                money_histories:[],
                disabled:false,
                API_USER_UPDATE: "/api/users/update",
                avatar_file:null,
                bound:false,
                uname:''
            }
        },
        components: {

        },
        mounted(){

        },
        created(){
            this.getUserInfo();
            this.refreshDatas();
        },
        computed: {},
        methods: {
            refreshDatas(){
                this.refreshDisplay = 'show';
                this.page = 1;
                this.getMoneyHistories();
            },
            modifyHead() {       //修改头像
                var self = this;
//                event.hideSoftKeyboard(this.$el('nameId'));
                photograph.takePicture(function(url) {
                    if(isNull(url)){

                    }else {
                        self.avatar_file=url;
                        self.user.avatar_url="file://"+url;
                    }
                },true);
            },
            getUserInfo() {
                var self = this;
                var url = '/api/users';

                weexModules.httpGet(url, null).then(function (response) {

                    if (response.error_code == 0) {
                        self.user = response;
                        self.username = response.username;
                        if(isNull(self.user.mobile)){
                            self.user.mobile="未绑定手机";
                            self.bound=true;
                        }
                        else{
                            self.bound=false;
                        }
                        if(self.user.sex==0){
                            self.css_male = 'sextext_unselect';
                            self.css_girl = 'sextext_select';
                        }else{
                            self.css_male = 'sextext_select';
                            self.css_girl = 'sextext_unselect';
                        }
                    }else if(response.error_code == -100){

                        event.sid(response.sid, function (json) {
                            event.setLoginState(false, function (json) {});

                            event.openURL("app://main/home");
                            event.openURL(app.getJsServerAddress() + 'login.js');
                        });

                    }else {
                        modal.toast( response.data.error_reason);
                    }
                });
            },
            sexSelect() {//性别切换
                if(this.user.sex){
                    this.user.sex=0;
                    this.css_male = 'sextext_unselect';
                    this.css_girl = 'sextext_select';
                }else{
                    this.user.sex=1;
                    this.css_male = 'sextext_select';
                    this.css_girl = 'sextext_unselect';
                }
            },
            onInput(e) {
                this.user.username = e.value;
            },
            onfocus() {
                this.username = '';
//                event.showSoftKeyboard(this.$el('nameId'));
            },
            onblur() {
//                event.hideSoftKeyboard(this.$el('nameId'));
            },
            usernameDivClick() {
            },
            finish(){
                var params = {
                    'animated': 'true',
                };
                navigator.pop(params, function () {
                });
            },
            updateInfo() {
                this.disabled = true;
                var self = this;
                var url = '/api/users/update';

                if(self.avatar_file==null){
                    weexModules.httpPost(url, {username: self.user.username, sex:self.user.sex}).then(function (response) {
                        if(response.error_code==0){
                            self.user = response;
                            modal.toast({
                                message:'保存成功',duration:1
                            });
                            self.finish();
                        }else{
                            modal.toast({'message': response.error_reason, duration: 2});
                        }
                    });

                }else {
                    event.showProcess(true);
                    weexModules.httpPost(url, {upload_file_upload_file_avatar:self.avatar_file, username: self.user.username, sex:self.user.sex}).then(function (response) {
                        event.showProcess(false);
                        if(response.error_code==0){
                            self.user = response;
                            modal.toast({
                                message:'保存成功',duration:1
                            });
                            self.finish();
                        }else{
                            modal.toast({'message': response.error_reason, duration: 2});
                        }
                    });
                }

                this.disabled = false;
            },
            getMoneyHistories() {

                var self = this;
                var url = '/api/users/money_history';

                weexModules.httpGet(url, {page:self.page,per_page:self.per_page}).then(function (response) {
                    if(self.page==1){
                        self.money_histories=[];
                    }
                    self.money_histories.push.apply(self.money_histories, response.money_histories);
                    self.loading_display = 'hide';
                    self.refreshDisplay = 'hide';
                    self.total_page = response.total_page;

                    //if(this.isIOS()) {
                        if (self.total_page > 1) {
                            self.loading_visiable = true;
                        }
                        else {
                            self.loading_visiable = false;
                        }
                    //}
                });

            },
            hideLoading(){
                setTimeout(() => {
                    this.loading_display = 'hide'
                }, 222)
            },
            loadMore() {
                this.loading_display = 'show';
                if(this.page<this.total_page) {
                    this.page++;
                    this.getMoneyHistories();
                }
                else{
                    modal.toast({
                        message:'已到最后',duration:1
                    });
                    this.hideLoading();
                }
            },
            goBound() {
                weexModules.gotoPage(app.getJsServerAddress()+'bound-phone.js') ;
            },
            leftClick() {
                this.finish()
            },
        }
    }
</script>
