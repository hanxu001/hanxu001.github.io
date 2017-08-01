<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';

    export default {
        data(){
            return {
                title: '一元购宝注册协议',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
            };
        },

        mounted(){
            
        },

        methods: {
            naviBarLeftItemClick () {
                weexModules.closePage();
            }
        }
    }
</script>