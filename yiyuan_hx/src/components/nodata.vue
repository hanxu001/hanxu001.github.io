
<template>
    <div class="nodata">
        <image class="nodata_img" :src="nonedata_img"></image>
        <text class="nodata_text" style="">{{nodata_title}}</text>
    </div>
</template>

<style>
    .nodata{
        width:750px;
        justify-content: center;
        align-items: center;
        padding-top: 340px;
    }
    .nodata_img{
        width: 304px;
        height: 261px;
    }
    .nodata_text{
        padding-top:60px;
        font-size:40px;
        color:#979797;
    }
</style>

<script>
    import appConfig from 'utils/AppConfig';
    export default {
        props: ['nodata_title'],
        data(){
            return {
                nonedata_img:appConfig.getImagesAddress()+'common_nodata.png',
                nodata_title:'暂无中奖记录',
                paddingtop:0,
            };
        },
    }
</script>