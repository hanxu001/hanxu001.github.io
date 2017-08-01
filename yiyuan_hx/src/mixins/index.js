
export default {
    methods: {
        jump (to) {
            if (this.$router) {
                this.$router.push(to)
            }
        },

        isIOS(){
            return weex.config.env ? weex.config.env.platform === 'iOS' : false;
        },
        hasValue(value){

            if (!value || value=='' || value=="false" || value == 'null'|| value==[] || value == {}) {
                return false;
            }
            return true;
        }
    }
}
