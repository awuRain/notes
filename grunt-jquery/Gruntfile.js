module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			options: {

			},
			// 这个是什么鬼怎么没有用耶，官方给的例子啊
			// files: {
			// 	'./style/main.css': './style/main.less'
			// },
			build: {
				src: './style/main.less',
				dest: './style/main.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', ['less']);
}

