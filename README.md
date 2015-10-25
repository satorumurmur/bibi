BiB/i
================================================================================================================================

EPUB Reader on your website.

1. How to setup & read/publish EPUB books (for users)
2. How to arrange development environment (for developers)
3. License
4. Special Thanks




1. How to setup & read/publish EPUB books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports two ways to read/publish EPUB books:

* Read in browsers on your local machine, or
* Publish on the web, to have your books read by someone.

In either case, download BiB/i from [web site](http://bibi.epub.link/#download) and unzip it at first.



### Read in browsers on your local machine

1. Open `bib/i/index.html` in your browser and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### Publish on the web

[Demo](http://bibi.epub.link/#demo).

You can publish both zipped archive and unzipped folder.
(Using unzipped is highly recommended.)


#### Use zipped archives

1. Upload `bib` directory to your web server,
2. Upload your EPUB books(for instance, `my-book.epub` here) to `bib/bookshelf` directory, and
3. Access to `http://your.web.site/bib/i/?book=my-book.epub` by your browser.
4. Or embed code below into your blog and visit the blog entry.

```
<a href="http://your.web.site/somewhere/bib/i/?book=my-book.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
```


#### Use unzipped archives (recommended)

You may also read EPUB books as unzipped archives, or by page-by-page access, by uploading unzipped EPUB books to `bookshelf` directory.
This is recommended because it accelarates reading experience of your readers.

1. Unzip an EPUB book,
    1. Change the file extension from `.epub` to `.zip` (`my-book.epub` -> `my-book.zip`) and then
    2. unzip the file with some tool.
2. Upload it to `bib/bookshelf` directory, and
3. Visit `http://your.web.site/bib/i/?book=my-book` (note that it has *No Extension*) or embed code for it.

```
<a href="http://your.web.site/somewhere/bib/i/?book=my-book" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
```




2. How to arrange development environment
--------------------------------------------------------------------------------------------------------------------------------


### Requirements

1. [Node.js + npm](http://nodejs.org/) - guide: “[Download the installer](http://nodejs.org/download/)” (or “[Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)”)
2. [Ruby](https://www.ruby-lang.org/) (+ [RubyGems](http://guides.rubygems.org/)) - guide: “[Installing Ruby](https://www.ruby-lang.org/en/installation/)” (+ “[RubyGems Basics](http://guides.rubygems.org/rubygems-basics/)”)
3. [Bundler](http://bundler.io/) - how to install: `$ gem update --system` and `$ gem install bundler`
4. [gulp](http://gulpjs.com/) - will be installed in following process.


### Arrangements

1. Clone this repository. (https://github.com/satorumurmur/bibi/)
2. `$ cd <the repository>`
3. `$ bundle install --path=vendor/bundle` -> `vendor/bundle` directory including RubyGems (Compass and dependent gems) is installed.
4. `$ npm install` -> `npm-modules` directory including "gulp" and other modules is installed.


### Development

1. Command `$ gulp` or `$ gulp build`, and renew these files:
    - `bib/i/res/scripts/bibi.js`
    - `bib/i/res/styles/bibi.css`
    - `bib/i.js`
    - `bib/i.css`
    - the extentions in `bib/i/extensions/`
2. Edit files.
    * SCSS source files of `bib/i/res/styles/bibi.css` is in `dev-bib/i/res/styles/`.
    * SCSS source files of `bib/i.css` are in `dev-bib/` and `dev-bib/i/res/styles/`.
    * JavaScript source files of `bib/i/res/scripts/bibi.js` are in `dev-bib/i/res/scripts/`.
    * JavaScript source file of `bib/i.js` is `dev-bib/i.js`.
    * JavaScript source files of the extensions in `bib/i/extensions/` are in `dev-bib/i/extensions/`.
3. Run web server for dynamic-compiling.
    * `$ bundle exec rackup`
    * A server starts listening port 9292 by default.
    * The server returns compiled CSS of SCSS files.

Following source files are not processed by gulp tasks:

* `bib/i/index.html` (as portal)
* `bib/manifest.json` (for using as Chrome application)
* Files in `bib/i/presets/` (customisable settings and styles)

And `bib/bookshelf/` directory is including `.gitkeep`




3. License
--------------------------------------------------------------------------------------------------------------------------------


### BiB/i

* &copy; Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
* Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php


### BiB/i is including and powered by these open source softwares:

* [Native Promise Only](https://github.com/getify/native-promise-only) ... &copy; Kyle Simpson (Licensed under the MIT license.)
* [easing.js](https://github.com/danro/easing-js) ... &copy; Dan Rogers ([Licensed under the MIT license.](http://danro.mit-license.org/))
* [sML](https://github.com/satorumurmur/sML) ... &copy; Satoru MATSUSHIMA (Licensed under the MIT license.)
* [The Elegant Icon Font](http://www.elegantthemes.com/blog/resources/elegant-icon-font) ... &copy; Elegant Themes, Inc. (Dual licensed under the GPL 2.0 and the MIT license.)
* [The Material Icons](https://www.google.com/design/icons/) ... &copy; Google Inc. (]Licensed under the Creative Common Attribution 4.0 International License (CC-BY 4.0)](http://creativecommons.org/licenses/by/4.0/))

#### BiB/i Extension: Unzipper is including and powered by these open source softwares:

* [JSZip](http://stuartk.com/jszip) ... &copy; Stuart Knightley (Dual licensed under the MIT license or GPLv3.)
* [base64.js](https://github.com/dankogai/js-base64) ... &copy; dankogai (Licensed under the MIT license.)




4. Special Thanks
--------------------------------------------------------------------------------------------------------------------------------

* KITAITI Makoto ... [@KitaitiMakoto](https://github.com/KitaitiMakoto)
* Shunsuke Ito ... [@shunito](https://github.com/shunito)