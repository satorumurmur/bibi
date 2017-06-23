BiB/i
================================================================================================================================

EPUB Reader on your website.




Summary
--------------------------------------------------------------------------------------------------------------------------------

You can publish EPUB books on the web with a permalink for each book, and you can embed it in other webpages (just like a YouTube video).



### Spec.

* EPUB 3 and 2 compliant.
* Open source. (MIT license)
* Made with JavaScript. Works compatibly with all major web browsers on Mac/PC/smartphones:
    - Safari
    - Chrome (Opera, Vivaldi, Brave)
    - Firefox
    - Microsoft Edge
    - Internet Explorer 11



### Table of Contents

1. [How to Setup & Read/Publish EPUB Books](#how-to-setup--readpublish-epub-books) (for Users/Publishers)
2. [How to Arrange Development Environment](#how-to-arrange-development-environment) (for Developers)
3. [License](#license)
4. [Special Thanks](#special-thanks)




--------------------------------------------------------------------------------------------------------------------------------




How to Setup & Read/Publish EPUB Books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports two ways to read/publish EPUB books:

* Read in browsers on your local machine, or
* Publish on the web, to have your books read by someone.

In either case,

1. Download BiB/i from [GitHub release page](https://github.com/satorumurmur/bibi/releases) or [BiB/i website](http://bibi.epub.link/#download).
2. And unzip it at first.



### Read in browsers on your local machine 

1. Open `bib/i/index.html` in your browser (except Internet Explorer), and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### Publish on the web

[Demo](http://bibi.epub.link/#demo).

You can publish both unzipped folder and zipped EPUB archive.

Using unzipped folder is recommended for the book which is heavy or contains many files.
Using zipped EPUB file is recommended for the book which is light or contains less files.


#### Publish unzipped folders

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


#### Publish zipped EPUB files

1. Upload `bib` directory into some directory on your web server.
2. Upload your EPUB book (ex. `BOOKNAME.epub`) to `bib/bookshelf` directory, and
3. Access to `http://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub` by your browser.
4. Or embed code for it.

````
<a href="http://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i frame, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
````



How to Arrange Development Environment
--------------------------------------------------------------------------------------------------------------------------------



### Requirements

* [Node.js + npm](http://nodejs.org/) - guide: “[Download the installer](http://nodejs.org/download/)” (or “[Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)”)



### Arrangements

1. Clone [this repository](https://github.com/satorumurmur/bibi/). 
2. `$ cd <the local repository>`
3. `$ npm install`
    - installs modules in `npm-modules` and `bower_components` directories.



### Development

1. `$ npm start` (or `$ $(npm bin)/gulp`)
    - builds distribution files,
    - launches a webserver and opens `http://localhost:3000/bib/i/?book=` in your browser,
    - watches/rebuilds changed files,
    - reloads/syncronizes browser(s).
2. Edit:
    - SCSS source file(s) of:
        - `bib/i/res/styles/bibi.css` are in `dev-bib/i/res/styles/`,
        - `bib/i.css` is `dev-bib/i.scss`.
    - JavaScript source file(s) of:
        - `bib/i/res/scripts/bibi.js` are in `dev-bib/i/res/scripts/` (and `bower_components/`).
        - `bib/i.js` is `dev-bib/i.js`.
        - the extensions in `bib/i/extensions/` are in `dev-bib/i/extensions/`.

* Following files are not processed by gulp tasks:
    - `bib/i/index.html`
    - `bib/manifest.json`
    - Files in `bib/i/presets/`
    - Files in `bib/bookshelf/`




License
--------------------------------------------------------------------------------------------------------------------------------


### BiB/i

* Copyright &copy; Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
* Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php


### BiB/i is including and powered by these open source softwares:

* [The Elegant Icon Font](http://www.elegantthemes.com/blog/resources/elegant-icon-font) ... Copyright &copy; Elegant Themes, Inc. (Dual licensed under the GPL 2.0 and MIT license.)
* [Font Awesome](http://fontawesome.io) ... Copyright &copy; Dave Gandy ([Licensed under SIL Open Font License (OFL) 1.1](http://scripts.sil.org/OFL))
* [Material Icons](https://material.io/icons/) ... Copyright &copy; Material Design Authors / Google Inc. ([Licensed under the Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0))
* [Native Promise Only](https://github.com/getify/native-promise-only) ... Copyright &copy; Kyle Simpson (Licensed under the MIT license.)
* [easing.js](https://github.com/danro/easing-js) ... Copyright &copy; Dan Rogers ([Licensed under the MIT license.](http://danro.mit-license.org/))
* [sML](https://github.com/satorumurmur/sML) ... Copyright &copy; Satoru MATSUSHIMA (Licensed under the MIT license.)


### BiB/i Extension: Unzipper is including and powered by these open source softwares:

* [JSZip](http://stuk.github.io/jszip) ... Copyright &copy; Stuart Knightley (Dual licensed under the MIT license or GPLv3.)
* [JSZipUtils](http://stuk.github.io/jszip-utils) ... Copyright &copy; Stuart Knightley (Dual licensed under the MIT license or GPLv3.)




Special Thanks
--------------------------------------------------------------------------------------------------------------------------------

* KITAITI Makoto ... [@KitaitiMakoto](https://github.com/KitaitiMakoto)
* Shunsuke ITO ... [@shunito](https://github.com/shunito)
