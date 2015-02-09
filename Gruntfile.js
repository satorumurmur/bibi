



module.exports = function(grunt){


	var path = require('path');

	var matchdep = require('matchdep');


	// Load All Grunt-Plugin Tasks
	matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);


	// Initialize Config
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Clean Document Directory
		clean: {
			css: [
				'bib/i/res/styles/bibi.css',
				'bib/i/res/styles/pipi.css'
			],
			js: [
				'bib/i/res/scripts/bibi.js'
			]
		},

		// Compile Compass/SCSS to CSS
		compass: {
			dev: {
				options: {
					bundleExec: true,
					config: 'config.rb',
					environment: 'development'
				}
			},
			prod: {
				options: {
					bundleExec: true,
					config: 'config.rb',
					environment: 'production'
				}
			}
		},

		// Combine Media Queries
		cmq: {
			options: {
				log: true
			},
			main: {
				files: {
					'bib/i/res/styles/': [
						'bib/i/res/styles/*.css'
					]
				}
			}
		},

		// Minify StyleSheets
		cssmin: {
			minify: {
				expand: true,
				cwd: 'bib/i/res/styles/',
				src: [
					'*.css'
				],
				dest: 'bib/i/res/styles/',
				ext: '.css'
			}
		},

		// Concat Scripts
		concat: {
			// Scripts
			script: {
				src: [
					'bibi-dev/res/scripts/lib/jszip.min.js',
					'bibi-dev/res/scripts/lib/base64.js',
					'bibi-dev/res/scripts/lib/hammer.min.js',
					'bibi-dev/res/scripts/lib/easing.js',
					'bibi-dev/res/scripts/lib/sML.js',
					'bibi-dev/res/scripts/src/bibi.core.js',
					'bibi-dev/res/scripts/src/bibi.epubcfi.js'
				],
				dest: 'bib/i/res/scripts/bibi.js'
			}
		},

		// Minify Scripts
		uglify: {
			script: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi - Copyright (c) Satoru MATSUSHIMA - Licensed under the MIT license.',
						' *',
						' * - Open Source Libraries',
						' *',
						' *     1. JSZip     - http://stuartk.com/jszip              - Copyright (c) Stuart Knightley  - Licenced under the MIT license. - bibi-dev/res/scripts/lib/jszip.min.js',
						' *     2. base64.js - https://github.com/dankogai/js-base64 - Copyright (c) dankogai          - Licensed under the MIT license. - bibi-dev/res/scripts/lib/base64.js',
						' *     3. Hammer.js - http://hammerjs.github.io/            - Copyright (c) Jorik Tangelder   - Licensed under the MIT license. - bibi-dev/res/scripts/lib/hammer.min.js',
						' *     4. easing.js - https://github.com/danro/easing-js    - Copyright (c) Dan Rogers        - Licensed under the MIT license. - bibi-dev/res/scripts/lib/easing.js',
						' *     5. sML       - https://github.com/satorumurmur/sML   - Copyright (c) Satoru MATSUSHIMA - Licensed under the MIT license. - bibi-dev/res/scripts/lib/sML.js',
						' *',
						' * - BiB/i Components',
						' *',
						' *     1. BiB/i Core              - bibi-dev/res/scripts/src/bibi.core.js',
						' *     2. BiB/i EPUBCFI Utilities - bibi-dev/res/scripts/src/bibi.epubcfi.js',
						' *',
						//' * - <%= grunt.template.today("yyyy/mm/dd") %>',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.script.dest%>'
				],
				dest: '<%= concat.script.dest%>'
			}
		},

		// Watch Some Files Status
		watch: {
			html: {
				options: {
					livereload: false
				},
				files: [
					'**/*.html'
				],
				tasks: [
					''
				]
			},
			style: {
				options: {
					livereload: false
				},
				files: [
					'bibi-dev/res/styles/src/*.scss'
				],
				tasks: [
					'build_minstyle',
					''
				]
			},
			script: {
				options: {
					livereload: false
				},
				files: [
					'bibi-dev/res/scripts/*/*.js'
				],
				tasks: [
					'build_minscript',
					''
				]
			}
		}

	});


	// Resiter Tasks

	grunt.registerTask('', []);
	grunt.registerTask('default', ['watch']);

	grunt.registerTask('build_minstyle', [
		'clean:css',
		'compass:prod',
		'cmq',
		'cssmin',
		''
	]);

	grunt.registerTask('build_minscript', [
		'clean:js',
		'concat:script',
		'uglify:script',
		''
	]);

	grunt.registerTask('build', [
		'build_minstyle',
		'build_minscript',
		''
	]);


};



