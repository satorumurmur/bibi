



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
			bibi_js: [
				'bib/i/res/scripts/bibi.js'
			],
			bibi_extention_cplus_js: [
				'bib/extentions/cplus/cplus.js'
			],
			bibi_extention_unzipper_js: [
				'bib/extentions/unzipper/unzipper.js'
			],
			bibi_extention_epubcfi_js: [
				'bib/extentions/epubcfi/epubcfi.js'
			],
			bibi_extention_jatex_js: [
				'bib/extentions/jatex/jatex.js'
			],
			pipi_js: [
				'bib/i.js'
			],
			bibi_css: [
				'bib/i/res/styles/bibi.css'
			],
			pipi_css: [
				'bib/i.css'
			]
		},

		// Concat Scripts
		concat: {
			bibi_js: {
				src: [
					'dev-bib/i/res/scripts/__lib/npo.src.js',
					'dev-bib/i/res/scripts/__lib/hammer.min.js',
					'dev-bib/i/res/scripts/__lib/easing.js',
					'dev-bib/i/res/scripts/__lib/sML.js',
					'dev-bib/i/res/scripts/bibi.core.js'
				],
				dest: 'bib/i/res/scripts/bibi.js'
			},
			bibi_extention_cplus_js: {
				src: [
					'dev-bib/i/extentions/cplus/cplus.viewmenu.js',
					'dev-bib/i/extentions/cplus/cplus.fullscreen.js',
					'dev-bib/i/extentions/cplus/cplus.arrows.js',
					'dev-bib/i/extentions/cplus/cplus.keys.js',
					'dev-bib/i/extentions/cplus/cplus.messages.js'
				],
				dest: 'bib/i/extentions/cplus/cplus.js'
			},
			bibi_extention_unzipper_js: {
				src: [
					'dev-bib/i/extentions/unzipper/unzipper.js',
					'dev-bib/i/extentions/unzipper/__lib/jszip.min.js',
					'dev-bib/i/extentions/unzipper/__lib/base64.js'
				],
				dest: 'bib/i/extentions/unzipper/unzipper.js'
			},
			bibi_extention_epubcfi_js: {
				src: [
					'dev-bib/i/extentions/epubcfi/epubcfi.js'
				],
				dest: 'bib/i/extentions/epubcfi/epubcfi.js'
			},
			bibi_extention_jatex_js: {
				src: [
					'dev-bib/i/extentions/jatex/jatex.js'
				],
				dest: 'bib/i/extentions/jatex/jatex.js'
			},
			pipi_js: {
				src: [
					'dev-bib/i.js'
				],
				dest: 'bib/i.js'
			}
		},

		// Minify Scripts
		uglify: {
			bibi_js: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i | Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi | Licensed under the MIT license.',
						' *',
						' * ## Including:',
						' * 1. dev-bib/i/res/scripts/__lib/npo.src.js    - Native Promise Only | Copyright (c) Kyle Simpson - https://github.com/getify/native-promise-only | Licensed under the MIT license.',
						' * 2. dev-bib/i/res/scripts/__lib/hammer.min.js - Hammer.js | Copyright (c) Jorik Tangelder - http://hammerjs.github.io/ | Licensed under the MIT license.',
						' * 3. dev-bib/i/res/scripts/__lib/easing.js     - easing.js | Copyright (c) Dan Rogers - https://github.com/danro/easing-js | Licensed under the MIT license.',
						' * 4. dev-bib/i/res/scripts/__lib/sML.js        - sML | Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML | Licensed under the MIT license.',
						' * 5. dev-bib/i/res/scripts/bibi.core.js        - BiB/i Core',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.bibi_js.dest%>'
				],
				dest: '<%= concat.bibi_js.dest%>'
			},
			bibi_extention_cplus_js: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i Extention: C+ Pack | Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi | Licensed under the MIT license.',
						' *',
						' * ## Including:',
						' * 1. dev-bib/i/extentions/cplus/cplus.viewmenu.js   - C+ViewMenu',
						' * 2. dev-bib/i/extentions/cplus/cplus.fullscreen.js - C+Fullscreen',
						' * 3. dev-bib/i/extentions/cplus/cplus.arrow.js      - C+Arrows',
						' * 4. dev-bib/i/extentions/cplus/cplus.keys.js       - C+Keys',
						' * 5. dev-bib/i/extentions/cplus/cplus.messages.js   - C+Messages',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.bibi_extention_cplus_js.dest%>'
				],
				dest: '<%= concat.bibi_extention_cplus_js.dest%>'
			},
			bibi_extention_unzipper_js: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i Extention: Unzipper | Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi | Licensed under the MIT license.',
						' *',
						' * ## Including:',
						' * 1. dev-bib/i/extentions/unzipper/unzipper.js        - Unzipper',
						' * 2. dev-bib/i/extentions/unzipper/__lib/jszip.min.js - JSZip | Copyright (c) Stuart Knightley - http://stuartk.com/jszip | Dual licensed under the MIT license or GPLv3.',
						' * 3. dev-bib/i/extentions/unzipper/__lib/base64.js    - base64.js | Copyright (c) dankogai - https://github.com/dankogai/js-base64 | Licensed under the MIT license.',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.bibi_extention_unzipper_js.dest%>'
				],
				dest: '<%= concat.bibi_extention_unzipper_js.dest%>'
			},
			bibi_extention_epubcfi_js: {
				options: {
					preserveComments: 'some',
					banner: ''
				},
				src: [
					'<%= concat.bibi_extention_epubcfi_js.dest%>'
				],
				dest: '<%= concat.bibi_extention_epubcfi_js.dest%>'
			},
			bibi_extention_jatex_js: {
				options: {
					preserveComments: 'some',
					banner: ''
				},
				src: [
					'<%= concat.bibi_extention_jatex_js.dest%>'
				],
				dest: '<%= concat.bibi_extention_jatex_js.dest%>'
			},
			pipi_js: {
				options: {
					preserveComments: 'some',
					banner: ''
				},
				src: [
					'<%= concat.pipi_js.dest%>'
				],
				dest: '<%= concat.pipi_js.dest%>'
			}
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
			bibi_css: {
				files: {
					'bib/i/res/styles/': [
						'bib/i/res/styles/bibi.css'
					]
				}
			},
			pipi_css: {
				files: {
					'bib/': [
						'bib/i.css'
					]
				}
			}
		},

		// Minify StyleSheets
		cssmin: {
			bibi_css: {
				expand: true,
				cwd: 'bib/i/res/styles/',
				src: [
					'bibi.css'
				],
				dest: 'bib/i/res/styles/',
				ext: '.css'
			},
			pipi_css: {
				expand: true,
				cwd: 'bib/',
				src: [
					'i.css'
				],
				dest: 'bib/',
				ext: '.css'
			}
		},

		// Watch Some Files Status
		watch: {
			bibi_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/i/res/scripts/__lib/*.js',
					'dev-bib/i/res/scripts/*.js'
				],
				tasks: [
					'build_bibi_js',
					''
				]
			},
			bibi_extention_cplus_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/extentions/cplus/*.js'
				],
				tasks: [
					'build_bibi_extention_cplus_js',
					''
				]
			},
			bibi_extention_unzipper_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/extentions/unzipper/*.js'
				],
				tasks: [
					'build_bibi_extention_unzipper_js',
					''
				]
			},
			bibi_extention_epubcfi_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/extentions/epubcfi/*.js'
				],
				tasks: [
					'build_bibi_extention_epubcfi_js',
					''
				]
			},
			bibi_extention_jatex_js: {
				options: {
					livereload: false
				},
				files: [
					'dev-bib/extentions/jatex/*.js'
				],
				tasks: [
					'build_bibi_extention_jatex_js',
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
			},
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
			}
		}

	});


	// Resiter Tasks

	grunt.registerTask('', []);
	grunt.registerTask('default', ['watch']);

	grunt.registerTask('build_bibi_js', [
		'clean:bibi_js',
		'concat:bibi_js',
		'uglify:bibi_js',
		''
	]);

	grunt.registerTask('build_bibi_extention_cplus_js', [
		'clean:bibi_extention_cplus_js',
		'concat:bibi_extention_cplus_js',
		'uglify:bibi_extention_cplus_js',
		''
	]);

	grunt.registerTask('build_bibi_extention_unzipper_js', [
		'clean:bibi_extention_unzipper_js',
		'concat:bibi_extention_unzipper_js',
		'uglify:bibi_extention_unzipper_js',
		''
	]);

	grunt.registerTask('build_bibi_extention_epubcfi_js', [
		'clean:bibi_extention_epubcfi_js',
		'concat:bibi_extention_epubcfi_js',
		'uglify:bibi_extention_epubcfi_js',
		''
	]);

	grunt.registerTask('build_bibi_extention_jatex_js', [
		'clean:bibi_extention_jatex_js',
		'concat:bibi_extention_jatex_js',
		'uglify:bibi_extention_jatex_js',
		''
	]);

	grunt.registerTask('build_pipi_js', [
		'clean:pipi_js',
		'concat:pipi_js',
		'uglify:pipi_js',
		''
	]);

	grunt.registerTask('build_scripts', [
		'build_bibi_js',
		'build_bibi_extention_cplus_js',
		'build_bibi_extention_unzipper_js',
		'build_bibi_extention_epubcfi_js',
		'build_bibi_extention_jatex_js',
		'build_pipi_js',
		''
	]);

	grunt.registerTask('build_bibi_css', [
		'clean:bibi_css',
		'compass:prod',
		'cmq:bibi_css',
		'cssmin:bibi_css',
		''
	]);

	grunt.registerTask('build_pipi_css', [
		'clean:pipi_css',
		'compass:prod',
		'cmq:pipi_css',
		'cssmin:pipi_css',
		''
	]);

	grunt.registerTask('build_styles', [
		'build_bibi_css',
		'build_pipi_css',
		''
	]);

	grunt.registerTask('build', [
		'build_scripts',
		'build_styles',
		''
	]);


};



