<style src="./style.css" scoped></style>
<template src="./template.html"></template>


<script>
    import app from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules'
    export default {
        data (){
            return {
                destUrl:''
            }
        },
        created(){

        },
        computed: {},
        methods: {
            retry() {
                weexModules.getTempData("network_disconnect_key").then(res =>{
                    if (res) {

                    } else { //本页刷新
                        weexModules.refresh();
                    }
                });
            }
        }
    }
</script>
