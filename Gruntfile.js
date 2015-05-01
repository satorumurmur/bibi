



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
			bibi_css: [
				'bib/i/res/styles/bibi.css'
			],
			pipi_css: [
				'bib/i.css'
			],
			bibi_js: [
				'bib/i/res/scripts/bibi.js'
			],
			pipi_js: [
				'bib/i.js'
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
			bibi: {
				files: {
					'bib/i/res/styles/': [
						'bib/i/res/styles/bibi.css'
					]
				}
			},
			pipi: {
				files: {
					'bib/': [
						'bib/i.css'
					]
				}
			}
		},

		// Minify StyleSheets
		cssmin: {
			bibi: {
				expand: true,
				cwd: 'bib/i/res/styles/',
				src: [
					'bibi.css'
				],
				dest: 'bib/i/res/styles/',
				ext: '.css'
			},
			pipi: {
				expand: true,
				cwd: 'bib/',
				src: [
					'i.css'
				],
				dest: 'bib/',
				ext: '.css'
			}
		},

		// Concat Scripts
		concat: {
			bibi: {
				src: [
					'dev-bib/i/res/scripts/__lib/jszip.min.js',
					'dev-bib/i/res/scripts/__lib/base64.js',
					'dev-bib/i/res/scripts/__lib/npo.src.js',
					'dev-bib/i/res/scripts/__lib/hammer.min.js',
					'dev-bib/i/res/scripts/__lib/easing.js',
					'dev-bib/i/res/scripts/__lib/sML.js',
					'dev-bib/i/res/scripts/bibi.core.js',
					'dev-bib/i/res/scripts/bibi.epubcfi.js'
				],
				dest: 'bib/i/res/scripts/bibi.js'
			},
			pipi: {
				src: [
					'dev-bib/i.js'
				],
				dest: 'bib/i.js'
			}
		},

		// Minify Scripts
		uglify: {
			bibi: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi - Copyright (c) Satoru MATSUSHIMA - Licensed under the MIT license.',
						' *',
						' * - Open Source Libraries:',
						' *',
						' *     1. dev-bib/i/res/scripts/__lib/jszip.min.js  - JSZip - http://stuartk.com/jszip - Copyright (c) Stuart Knightley - Dual licensed under the MIT license or GPLv3.',
						' *     2. dev-bib/i/res/scripts/__lib/base64.js     - base64.js - https://github.com/dankogai/js-base64 - Copyright (c) dankogai - Licensed under the MIT license.',
						' *     3. dev-bib/i/res/scripts/__lib/npo.src.js    - Native Promise Only - https://github.com/getify/native-promise-only - Copyright (c) Kyle Simpson - Licensed under the MIT license.',
						' *     4. dev-bib/i/res/scripts/__lib/hammer.min.js - Hammer.js - http://hammerjs.github.io/ - Copyright (c) Jorik Tangelder - Licensed under the MIT license.',
						' *     5. dev-bib/i/res/scripts/__lib/easing.js     - easing.js - https://github.com/danro/easing-js - Copyright (c) Dan Rogers - Licensed under the MIT license.',
						' *     6. dev-bib/i/res/scripts/__lib/sML.js        - sML - https://github.com/satorumurmur/sML - Copyright (c) Satoru MATSUSHIMA - Licensed under the MIT license.',
						' *',
						' * - BiB/i Components:',
						' *',
						' *     1. dev-bib/i/res/scripts/bibi.core.js        - BiB/i Core',
						' *     2. dev-bib/i/res/scripts/bibi.epubcfi.js     - BiB/i EPUBCFI Utilities',
						' *',
						//' * - <%= grunt.template.today("yyyy/mm/dd") %>',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.bibi.dest%>'
				],
				dest: '<%= concat.bibi.dest%>'
			},
			pipi: {
				options: {
					preserveComments: 'some',
					banner: ''
				},
				src: [
					'<%= concat.pipi.dest%>'
				],
				dest: '<%= concat.pipi.dest%>'
			}
		},

		// Watch Some Files Status
		watch: {
			bibi_css: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/i/res/styles/_common-icons.scss',
					'dev-bib/i/res/styles/_bibi-stage.scss',
					'dev-bib/i/res/styles/_bibi-controls.scss',
					'dev-bib/i/res/styles/bibi.scss'
				],
				tasks: [
					'build_bibi_css',
					''
				]
			},
			pipi_css: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/i/res/styles/_common-icons.scss',
					'dev-bib/i/res/styles/_pipi-style.scss',
					'dev-bib/i.scss'
				],
				tasks: [
					'build_pipi_css',
					''
				]
			},
			bibi_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/i/res/scripts/__lib/*.js',
					'dev-bib/i/res/scripts/bibi.core.js',
					'dev-bib/i/res/scripts/bibi.epubcfi.js'
				],
				tasks: [
					'build_bibi_js',
					''
				]
			},
			pipi_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/i.js'
				],
				tasks: [
					'build_pipi_js',
					''
				]
			}
		}

	});


	// Resiter Tasks

	grunt.registerTask('', []);
	grunt.registerTask('default', ['watch']);

	grunt.registerTask('build_bibi_css', [
		'clean:bibi_css',
		'compass:prod',
		'cmq:bibi',
		'cssmin:bibi',
		''
	]);

	grunt.registerTask('build_pipi_css', [
		'clean:pipi_css',
		'compass:prod',
		'cmq:pipi',
		'cssmin:pipi',
		''
	]);

	grunt.registerTask('build_styles', [
		'build_bibi_css',
		'build_pipi_css',
		''
	]);

	grunt.registerTask('build_bibi_js', [
		'clean:bibi_js',
		'concat:bibi',
		'uglify:bibi',
		''
	]);

	grunt.registerTask('build_pipi_js', [
		'clean:pipi_js',
		'concat:pipi',
		'uglify:pipi',
		''
	]);

	grunt.registerTask('build_scripts', [
		'build_bibi_js',
		'build_pipi_js',
		''
	]);

	grunt.registerTask('build', [
		'build_styles',
		'build_scripts',
		''
	]);


};



