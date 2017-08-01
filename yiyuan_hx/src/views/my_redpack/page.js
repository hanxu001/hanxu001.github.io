/**
 * Created by apple on 2017/4/6.
 */
import appConfig from 'utils/AppConfig';
class page {
    constructor() {

    }

    getProducts() {
        return [
            {
                id: 0,
                name: "玖富叮当贷款-让借轻松起来",
                icon_url: appConfig.getImagesAddress()+"logo.png",
                short_intro: "一步授权淘宝，3分钟获取信用额度",
                period_type: 0,
                amount_min: 200,
                amount_max: 5000,
                interest_min: 0.8,
                interest_max: 0.9
            },
            {
                id: 1,
                name: "玖富叮当贷款-让借轻松起来",
                icon_url: appConfig.getImagesAddress()+"logo.png",
                short_intro: "一步授权淘宝，3分钟获取信用额度",
                period_type: 0,
                amount_min: 200,
                amount_max: 5000,
                interest_min: 0.8,
                interest_max: 0.9
            },
            {
                id: 2,
                name: "玖富叮当贷款-让借轻松起来",
                icon_url: appConfig.getImagesAddress()+"logo.png",
                short_intro: "一步授权淘宝，3分钟获取信用额度",
                period_type: 0,
                amount_min: 200,
                amount_max: 5000,
                interest_min: 0.8,
                interest_max: 0.9
            },
            {
                id: 3,
                name: "玖富叮当贷款-让借轻松起来",
                icon_url: appConfig.getImagesAddress()+"logo.png",
                short_intro: "一步授权淘宝，3分钟获取信用额度",
                period_type: 0,
                amount_min: 200,
                amount_max: 5000,
                interest_min: 0.8,
                interest_max: 0.9
            },


        ];
    }
}

export default new page();