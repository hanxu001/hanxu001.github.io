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
                image_urlsy:{},
            };
        },

        mounted(){
            this.getImageData() ;
        },

        methods: {
            onclickBack:function () {
                weexModules.closePage();
            },

            getImageData:function () {
                var self = this ;

                weexModules.getTempData('Shaidan_Image').then(function(json){
                    self.image_urlsy = json.dataindex ;
                });
            }
        }
    }
</script>