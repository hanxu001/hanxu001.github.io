<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';
    var photograph = weex.requireModule('PhotographModule')
    var dom = weex.requireModule('dom');

    //    import page from './page'

    export default {
        data(){
            return {
                title:"中奖晒单",
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                image_address:appConfig.getImagesAddress()+'image_create_button@2x.png',
                footer:false,
                imglist:[],
                showadd:true,
                suggestion_back:'',
                product_id:'',
                product:'',
            };
        },

        created(){
            weexModules.setVue(this);

            var  self = this;
            var data = weexModules.getParams();
            this.product_id = data.id;

        },
        mounted(){

            this.getProductData() ;
        },

        methods: {
            naviBarLeftItemClick:function () {
                weexModules.closePage();
            },


            getProductData:function () {
                var self = this ;

                weexModules.getTempData('lucky_data',true ).then(res => {

                    if (res&&res.hasOwnProperty('dataindex')) {

                        self.product = res.dataindex;
                    }
                });
            },
            inputEvent:function (e) {

                var text = e.value.substr(0,100);

                if(e.value.length >= 100){
                    dom.updateAttrs(this.$refs['input1'],{value:text})
                }

                this.suggestion_back = e.value ;
            },
            goShai:function (e) {

                var self = this ;
                if (isNull(this.suggestion_back)) {
                    weexModules.toast('提交内容不能为空');
                    return;
                }
                var urls= appConfig.getApiServerAddress()+'/api/period_products/create_share';
                var len = this.imglist.length;
                if (len <=0) {
                    weexModules.toast('请选择至少一张图片');
                    return;
                }
//                weexModules.toast('长度:'+len);
                var saber={
                    id:this.product_id,
                    share_content:this.suggestion_back,
                };
                for (var i =0; i < len; i++) {
                    if (this.imglist[i].indexOf('file://') >=0) {
                        var key = 'upload_file_upload_file_image'+i;
                        saber[key] = this.imglist[i].substring('file://'.length, this.imglist[i].length);
                    }
                }
                weexModules.httpPost(urls,saber).then((response) => {
                    if (response.error_code >= 0) {

                        self.product.share_status = 1 ;
                        weexModules.toast('晒单成功');
                        //weexModules.setTempData('share_success', {share_success: true});
                        var vitem = self.product ;

                        //weexModules.setTempData('lucky_data',{dataindex:vitem}) ;

                        weexModules.closePage();
                    }
                    else {
                        weexModules.toast(response.error_reason);
                        //weexModules.setTempData('share_success', {share_success: false});
                    }

                })
            },
            goChoose:function () {

                this.$refs['input1'].blur() ;

                var self = this;

                photograph.takePicture(function (url) {
                    console.log("当前选中url:"+url)
                    if(!isNull(url)){
                        self.imglist.push("file://"+url);
                        console.log("imglist.length:"+self.imglist.length)
                        if(self.imglist.length >= 3){
                            self.showadd = false;
                        }
                    }
                });
            },
        }
    }
</script>