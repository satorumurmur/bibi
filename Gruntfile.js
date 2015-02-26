



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
				'bib/i/res/styles/pipi.css'
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
					'bib/i/res/styles/': [
						'bib/i/res/styles/pipi.css'
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
				cwd: 'bib/i/res/styles/',
				src: [
					'pipi.css'
				],
				dest: 'bib/i/res/styles/',
				ext: '.css'
			}
		},

		// Concat Scripts
		concat: {
			bibi: {
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
			},
			pipi: {
				src: [
					'bibi-dev/res/scripts/src/pipi.js'
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
						' *     1. JSZip     - http://stuartk.com/jszip              - Copyright (c) Stuart Knightley  - Dual licensed under the MIT license or GPLv3. - bibi-dev/res/scripts/lib/jszip.min.js',
						' *     2. base64.js - https://github.com/dankogai/js-base64 - Copyright (c) dankogai          - Licensed under the MIT license.               - bibi-dev/res/scripts/lib/base64.js',
						' *     3. Hammer.js - http://hammerjs.github.io/            - Copyright (c) Jorik Tangelder   - Licensed under the MIT license.               - bibi-dev/res/scripts/lib/hammer.min.js',
						' *     4. easing.js - https://github.com/danro/easing-js    - Copyright (c) Dan Rogers        - Licensed under the MIT license.               - bibi-dev/res/scripts/lib/easing.js',
						' *     5. sML       - https://github.com/satorumurmur/sML   - Copyright (c) Satoru MATSUSHIMA - Licensed under the MIT license.               - bibi-dev/res/scripts/lib/sML.js',
						' *',
						' * - BiB/i Components:',
						' *',
						' *     1. BiB/i Core              - bibi-dev/res/scripts/src/bibi.core.js',
						' *     2. BiB/i EPUBCFI Utilities - bibi-dev/res/scripts/src/bibi.epubcfi.js',
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
					'bibi-dev/res/styles/src/_common-icons.scss',
					'bibi-dev/res/styles/src/_bibi-stage.scss',
					'bibi-dev/res/styles/src/_bibi-controls.scss',
					'bibi-dev/res/styles/src/bibi.scss'
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
					'bibi-dev/res/styles/src/_common-icons.scss',
					'bibi-dev/res/styles/src/_pipi.scss',
					'bibi-dev/res/styles/src/pipi.scss'
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
					'bibi-dev/res/scripts/lib/*.js',
					'bibi-dev/res/scripts/src/bibi.core.js',
					'bibi-dev/res/scripts/src/bibi.epubcfi.js'
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
					'bibi-dev/res/scripts/src/pipi.js'
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



