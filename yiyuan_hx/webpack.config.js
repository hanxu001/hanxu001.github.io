/**
 * @author walid
 * @date 2016/03/20
 * @description weex 打包配置
 */

const path = require('path')
const webpack = require('webpack')
const cssnext = require('postcss-cssnext')
const fs = require('fs-extra')

const bannerPlugin = new webpack.BannerPlugin(
    '// { "framework": "Vue" }\n',
    {raw: true}
)

function getEntryFileContent(entryPath, vueFilePath) {
    const relativePath = path.relative(path.join(entryPath, '../'), vueFilePath);

    const components =  path.resolve(__dirname, './src/components/');
    const mixins = path.resolve(__dirname, './src/mixins/');
    const filters =path.resolve(__dirname, './src/filters/');
    return `
/**
 * @author walid
 * @date 2016/03/20
 * @description 程序入口启动配置
 */

import App  from '${relativePath}'
import mixins from 'mixins/index'
// import rootComponent from '${components}/osc-root'

import * as filters from 'filters/index'



// const App = require('${relativePath}')

// 注册全局 component
Vue.component('yc-list', require('components/yc-list.vue'))
// Vue.component('osc-root', require('components/osc-root'))
Vue.component('osc-navpage', require('components/osc-navpage'))
Vue.component('osc-navbar', require('components/osc-navbar'))
Vue.component('nodata', require('components/nodata'))
Vue.component('marquee', require('components/marquee'))
// Vue.component('osc-tabbar', require('components/osc-tabbar'))
// Vue.component('osc-list', require('components/osc-list'))
// Vue.component('osc-scroller', require('components/osc-scroller'))

// Vue.use(require('utils/config'))

// 注册全局 module
// weex.registerModule('api', require('utils/api'))
// weex.registerModule('route', require('constants/route'))

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// register global mixins.
Vue.mixin(mixins)

// App.el = '#root'
// new Vue(App)

new Vue(Vue.util.extend({ el: '#root' }, App))
`
}

var notBuildDir = ['components'];//不用编译成js的文件夹
var imgsDirs = ['common_imgs', 'imgs'];
var imgExtname = ['.jpg', '.bmp', '.jpeg', '.gif', '.png']; //BMP、JPG、JPEG、PNG、GIF
const entry = {}

//拷贝图片
function copyImages(imagedir) {
    //目标目录 + getBaseConfig().output.path
    let distDir = path.join(__dirname, './' , 'hybrid/yiyuan/image');
    // let fullpath = path.join(__dirname, './src', dir);
    fs.copySync(imagedir, distDir);
}

//entrypath 相对路径  根路径
function entryImgsCopy(entrypath) {
    fs.readdirSync(entrypath).forEach(file=>{
        let entryP = path.join(entrypath, file);//完整路径
        let stat = fs.statSync(entryP);
        let basename = path.basename(entryP);

        if (stat.isDirectory()) {
            if (imgsDirs.includes(basename)) {
                copyImages(entryP)
            } else {
                entryImgsCopy(entryP);
            }
        }
    });
}

function walk(dir) {
    dir = dir || '.'
    let directory = path.join(__dirname, './src', dir)
    let entryDirectory = path.join(__dirname, './src/entry');
    fs.readdirSync(directory)
        .forEach(file => {
            let fullpath = path.join(directory, file);
            let stat = fs.statSync(fullpath);
            let extname = path.extname(fullpath);

            if (stat.isFile() && extname === '.vue') {
                let entryFile = path.join(entryDirectory, dir, path.basename(file, extname) + '.js')
                fs.outputFileSync(entryFile, getEntryFileContent(entryFile, fullpath))
                var name = path.join(dir, path.basename(file, extname));
                name = dir.replace(/\//g, "_");
                name = name.replace(/^views_/, "");


                entry[name] = entryFile //+ '?entry=true'
            } else if (stat.isDirectory()) {
                let subdir = path.join(dir, file)
                let baseN = path.basename(subdir);
                if (imgsDirs.includes(baseN)) {
                    copyImages(fullpath)
                }

                if (!notBuildDir.includes(subdir)) {
                    if (fs.existsSync(path.join(fullpath, 'entry.js'))) { //使用vue-router
                        var name = subdir.replace(/\//g, "_");//根据目录+vue 名创建js文件
                        name = name.replace(/^views_/, "");
                        entry[name] = path.join(fullpath, 'entry.js');

                        //如果有router.js 文件
                        // let one
                        //遍历里面所有文件夹复制图片
                        entryImgsCopy(fullpath);
                        // let relativePath = path.join('./src', subdir);
                        // entry[baseN] = path.resolve(relativePath, 'entry.js');
                    } else {
                        walk(subdir)
                    }
                }
            }
        })
}

walk()

function getBaseConfig() {
    return {
        entry,
        output: {
            path:'hybrid/yiyuan',
        },
        resolve: {
            extensions: ['', '.js', '.vue'],
            fallback: [path.join(__dirname, './node_modules')],
            alias: {
                'components': path.resolve(__dirname, './src/components/'),
                'utils': path.resolve(__dirname, './src/utils/'),
                'mixins':path.resolve(__dirname, './src/mixins/'),
                'filters':path.resolve(__dirname, './src/filters/')
            }
        },
        module: {

            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/
                }, {
                    test: /\.vue(\?[^?]+)?$/,
                    loaders: []
                }
            ]
        },
        vue: {
            postcss: [cssnext({
                features: {
                    autoprefixer: false
                }
            })]
        },
        plugins: [bannerPlugin]
    }
}

const webConfig = getBaseConfig()


webConfig.output.filename = 'web/[name].js'
webConfig.module.loaders[1].loaders.push('vue')

const weexConfig = getBaseConfig()
weexConfig.output.filename = '[name].js'
weexConfig.module.loaders[1].loaders.push('weex')

module.exports = weexConfig
