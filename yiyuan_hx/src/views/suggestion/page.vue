<style src="./style.css" scoped></style>
<template src="./template.html"></template>

<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull,startsWith} from 'utils/Utils';
    var dom = weex.requireModule('dom');

    //    import page from './page'

    export default {
        data(){
            return {
                title: '意见反馈',
                placeholder:'请输入100字以内的问题描述',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',

                suggestionBackContent: '',
            };
        },

        mounted(){
//            this.navBarHeight = app.iosNavHeight(this, this.navBarHeight);
//            this.$on('naviBar.leftItem.click', function () {
//                event.openURLBack('', '');
//            });
        },

        methods: {
            commitSuggestionBack: function (){
                if (isNull(this.suggestionBackContent)){
                    weexModules.toast("提交内容不能为空");
                    return false;
                }

//                weexModules.toast("suggestionBackContent:"+this.suggestionBackContent.length);
                if(this.suggestionBackContent.length>100){
                    weexModules.toast("请输入100字以内的问题描述");
                    return false;
                }
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/suggests/create', {content:this.suggestionBackContent}).then((res) =>{
                    if(res.error_code == 0){
                        weexModules.toast("反馈成功");
                        weexModules.gotoPage("");
                    }else{
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
            inputEvent:function (e) {

                var text = e.value.substr(0,100);

                if(e.value.length >= 100){
                    dom.updateAttrs(this.$refs['input1'],{value:text})
                }

                this.suggestionBackContent = e.value ;
            },
        }
    }
</script>