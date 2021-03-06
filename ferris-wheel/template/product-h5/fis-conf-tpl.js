var deploy = 'http://cp01-qa-lvyou-001.cp01.baidu.com:8080';
var cdndomain = ['http://cp01-qa-lvyou-001.cp01.baidu.com:8080'];
fis.config.merge({
    modules : {
        preprocessor : {
            html : 'juicer-parse'
        },
        postprocessor : {
            js : 'jswrapper,require-async',
            html: 'require-async'
        },
        postpackager : ['autoload', 'simple']
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type : 'amd'
            }
        },
        spriter: {
            csssprites: {
                margin: 50
            }
        }
    },
    roadmap : {
        domain: {
            '**.js': cdndomain,
            '**.css': cdndomain,
            'image': cdndomain,
            '**.less': cdndomain
        }
    },
    pack:{
        'pkg/modules-combine.js': [
            '/modules/**.js',
            '/widgets/**.js'
        ],
        'pkg/modules-combine.css': [
            '/modules/**.css',
            '/widgets/**.css'
        ]
    },
    deploy: {
        remote: [{
            receiver: deploy + '/static/receiver.php',
            from: '/static',
            subOnly : true,
            to: '/home/lv/webroot/static/event-cms/${eventName}/static',
            exclude: /.*\.(?:svn|cvs|tar|rar|psd).*/
        },{
            receiver: deploy + '/static/receiver.php',
            from: '/page',
            subOnly : true,
            to: '/home/lv/webroot/static/event-cms/${eventName}/page',
            exclude: /.*\.(?:svn|cvs|tar|rar|psd).*/
        }]
    }
});
fis.config.set('roadmap.path',  [
    {
        reg : /^\/pkg\/(.*\.(?:css|js))$/i,
        isMod:false,
        release: '/static/pkg/$1',
        url: '/static/event-cms/${eventName}/static/pkg/$1'
    },{
        reg: /^\/lib\/(.*\.js)$/i,
        isMod : false,
        release: '/static/lib/$1',
        url: '/static/event-cms/${eventName}/static/lib/$1'
    },{
        reg : /^\/widgets\/([^\/]+)\/\1\.(js)$/i,
        isMod : true,
        id : '$1',
        release: '/static/widgets/$1/$1' + '.js',
        url: '/static/event-cms/${eventName}/static/widgets/$1/$1' + '.js'
    },{
        reg : /^\/modules\/([^\/]+)\/\1\.(js)$/i,
        isMod : true,
        id : '$1',
        release: '/static/modules/$1/$1' + '.js',
        url: '/static/event-cms/${eventName}/static/modules/$1/$1' + '.js'
    },{
        reg : /^\/modules\/(.*)\.(js)$/i,
        isMod : true,
        id : '$1',
        release: '/static/modules/$1' + '.js',
        url: '/static/event-cms/${eventName}/static/modules/$1' + '.js'
    },{
        reg : /^\/widgets\/(.*)\.(js)$/i,
        isMod : true,
        id : '$1',
        release: '/static/widgets/$1' + '.js',
        url: '/static/event-cms/${eventName}/static/widgets/$1' + '.js',
    },{
        reg : /^\/widgets\/([^\/]+)\/\1\.(js)$/i,
        isMod : true,
        id : '$1',
        release: '/static/widgets/$1/$1' + '.js',
        url: '/static/event-cms/${eventName}/static/modules/$1/$1' + '.js'
    },{
        reg : /^\/page\/(.*)\.(js)$/i,
        isMod : true,
        release: '/page/$1',
        url: '/static/event-cms/${eventName}/page/$1'
    },{
        reg : /^\/page\/(.*\.(?:png|gif|webp|jpg))$/i,
        isMod:false,
        release: '/page/$1',
        url: '/static/event-cms/${eventName}/page/$1'
    },{
        reg : /^\/page\/(.*\.(?:css|less))$/i,
        isMod:false,
        release: '/page/$1',
        url: '/static/event-cms/${eventName}/page/$1'
    },{
        reg : /^\/widgets\/(.*)\.(?:css|less)$/i,
        release: '/static/widgets/$1' + '.css',
        url: '/static/event-cms/${eventName}/static/widgets/$1' + '.css',
    },{
        reg : /^\/widgets\/(.*)\.(?:html)$/i,
        release: '/static/widgets/$1' + '.html',
        url: '/static/event-cms/${eventName}/static/widgets/$1' + '.html',
    },{
        reg : /^\/widgets\/(.*)\.(?:json)$/i,
        release: '/static/widgets/$1' + '.json',
        url: '/static/event-cms/${eventName}/static/widgets/$1' + '.json',
    },{
        reg:/^\/widgets\/(.*)\.(eot|svg|ttf|woff)$/i,
        release: '/static/widgets/$1' + '.$2',
        url: '/static/event-cms/${eventName}/static/widgets/$1' + '.$2'
    },{
        reg : "**.css",
        useSprite : true
    }, {
        reg : /\/readme.md$/i,
        release : false
    }
]);
fis.config.set('settings.postpackager.autoload.useInlineMap', true);
fis.config.set('modules.parser.less', 'less');
fis.config.set('roadmap.ext.less', 'css');
fis.config.set('modules.spriter', 'csssprites');
