BiB/i
================================================================================================================================

EPUB Reader on your website.


Summary
--------------------------------------------------------------------------------------------------------------------------------

You can publish EPUB books on the web with a parmalink for each book, and you can embed it in other webpages (just like a YouTube video).

### Spec.

+ EPUB 3 and 2 compliant.
+ Open source. (MIT lisence)
+ Made with JavaScript, works compatibly with all major web browsers on Mac/PC/smartphones:
    - Safari
    - Chrome, Android Browser, Opera, Vivaldi
    - Firefox
    - Microsoft Edge
    - Internet Explorer 11 (except opening zipped EPUB archive)




Table of Contents
--------------------------------------------------------------------------------------------------------------------------------

1. How to setup & read/publish EPUB books (for users/publishers)
2. How to arrange development environment (for developers)
3. License
4. Special thanks




1. How to setup & read/publish EPUB books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports two ways to read/publish EPUB books:

+ Read in browsers on your local machine, or
+ Publish on the web, to have your books read by someone.

In either case,

1. Download BiB/i from [GitHub repositoly page](https://github.com/satorumurmur/bibi)'s right sidebar or [BiB/i web site](http://bibi.epub.link/#download),
2. And unzip it at first.



### Read in browsers on your local machine 

1. Open `bib/i/index.html` in your browser (except Internet Explorer), and
2. Drag an EPUB book and drop it into the window.
3. That's all!


### Publish on the web

[Demo](http://bibi.epub.link/#demo).

You can publish both unzipped folder and zipped EPUB archive. But using unzipped folder is highly recommended.


#### Publish unzipped folders (Recommended)

This is recommended. It accelarates reading experience of your readers, and is more compatible with many browsers.

1. Upload `bib` directory into some directory on your web server.
2. Unzip an EPUB book,
    1. Change the file extension from `.epub` to `.zip` (`BOOKNAME.epub` -> `BOOKNAME.zip`), and
    2. Unzip the file with some tool.
3. Upload the unzipped folder `BOOKNAME` into `bib/bookshelf` directory, and
4. Access to `http://your.web.site/somewhere/bib/i/?book=BOOKNAME` by your browser. (note that it has no extension)
5. Or embed code below into your blog entry or other webpages, and visit the entry.

````
<a href="http://your.web.site/somewhere/bib/i/?book=BOOKNAME" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i frame, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
````


#### Publish zipped EPUB archives (Not recommended)

This is not recommended. It is slow and not compatible with Internet Explorer.

1. Upload `bib` directory into some directory on your web server.
2. Upload your EPUB book (ex. `BOOKNAME.epub`) to `bib/bookshelf` directory, and
3. Access to `http://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub` by your browser.
4. Or embed code for it.

````
<a href="http://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i frame, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
````



2. How to arrange development environment
--------------------------------------------------------------------------------------------------------------------------------


### Requirements

1. [Node.js + npm](http://nodejs.org/) - guide: “[Download the installer](http://nodejs.org/download/)” (or “[Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)”)
2. [Ruby](https://www.ruby-lang.org/) (+ [RubyGems](http://guides.rubygems.org/)) - guide: “[Installing Ruby](https://www.ruby-lang.org/en/installation/)” (+ “[RubyGems Basics](http://guides.rubygems.org/rubygems-basics/)”)
3. [Bundler](http://bundler.io/) - how to install: `$ gem update --system` and `$ gem install bundler`
4. [gulp](http://gulpjs.com/) - how to install: `$ npm install -g gulp`


### Arrangements

1. Clone [this repository](https://github.com/satorumurmur/bibi/). 
2. `$ cd <the local repository>`
3. `$ bundle install --path=vendor/bundle` -> make `vendor/bundle` directory and install RubyGems in it.
4. `$ npm install` -> make `npm-modules` directory and install modules in it.


### Development

1. Edit source files:
    - SCSS source files of `bib/i/res/styles/bibi.css` is in `dev-bib/i/res/styles/`.
    - SCSS source files of `bib/i.css` are in `dev-bib/` and `dev-bib/i/res/styles/`.
    - JavaScript source files of `bib/i/res/scripts/bibi.js` are in `dev-bib/i/res/scripts/`.
    - JavaScript source file of `bib/i.js` is `dev-bib/i.js`.
    - JavaScript source files of the extensions in `bib/i/extensions/` are in `dev-bib/i/extensions/`.
2. `$ gulp build`
    - cleans all the distribution files,
    - and makes all the distribution files from the source files.


### Other utilities for development:

+ `$ gulp watch`
    - It runs `build` task at first,
    - watches the changes of source files,
    - and rebuild the distribution files automatically when the source files are changed.
+ `$ gulp sync`
    - It runs `watch` task at first,
    - launches a web server listening port 3000 by default,
    - opens a browser and load `http://localhost:3000/bib/i/?book=`,
    - reloads your browser automatically when the distribution files are changed,
    - and syncronizes your browsers on same URI in the web server.
+ `$ bundle exec rackup`
    - It launches a web server listening port 9292 by default,
    - and the server returns compiled CSS dynamically to your browser's request for the SCSS source files.

The default task of gulp is `sync`. (`$ gulp` is same as `$ gulp sync`)


### Following files are not processed by gulp tasks:

+ `bib/i/index.html` ... as portal
+ `bib/manifest.json` ... for using as Chrome application
+ Files in `bib/i/presets/` ... customisable settings and styles
+ Files in `bib/bookshelf/` .... this directory is including `.gitkeep`





3. License
--------------------------------------------------------------------------------------------------------------------------------


### BiB/i

+ &copy; Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
+ Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php


### BiB/i is including and powered by these open source softwares:

+ [Native Promise Only](https://github.com/getify/native-promise-only) ... &copy; Kyle Simpson (Licensed under the MIT license.)
+ [easing.js](https://github.com/danro/easing-js) ... &copy; Dan Rogers ([Licensed under the MIT license.](http://danro.mit-license.org/))
+ [sML](https://github.com/satorumurmur/sML) ... &copy; Satoru MATSUSHIMA (Licensed under the MIT license.)
+ [The Elegant Icon Font](http://www.elegantthemes.com/blog/resources/elegant-icon-font) ... &copy; Elegant Themes, Inc. (Dual licensed under the GPL 2.0 and the MIT license.)
+ [The Material Icons](https://www.google.com/design/icons/) ... &copy; Google Inc. ([Licensed under the Creative Common Attribution 4.0 International License (CC-BY 4.0)](http://creativecommons.org/licenses/by/4.0/))


### BiB/i Extension: Unzipper is including and powered by these open source softwares:

+ [JSZip](http://stuartk.com/jszip) ... &copy; Stuart Knightley (Dual licensed under the MIT license or GPLv3.)
+ [base64.js](https://github.com/dankogai/js-base64) ... &copy; dankogai (Licensed under the MIT license.)




4. Special thanks
--------------------------------------------------------------------------------------------------------------------------------

+ KITAITI Makoto ... [@KitaitiMakoto](https://github.com/KitaitiMakoto)
+ Shunsuke ITO ... [@shunito](https://github.com/shunito)