/**
 * Created by apple on 2017/3/13.
 */

 class AppConfig {
    getApiServerAddress() {
        return '';
    }

    getImagesAddress() {
        // return "http://192.168.199.25:8081/hybrid/yiyuan/image/";
        return 'image://';
    }

    getJsServerAddress() {
        return 'js://';
    }

    getWebViewAddress() {
        return 'url://';
    }
}

export default new AppConfig();