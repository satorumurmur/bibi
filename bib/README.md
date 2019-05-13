BiB/i
================================================================================================================================

EPUB Reader on your website.




Summary
--------------------------------------------------------------------------------------------------------------------------------

You can publish EPUB books on the web with a permalink for each book, and you can embed it in other webpages (just like a YouTube video).



### Spec.

* EPUB 3 and 2 compliant.
* Open source. (MIT license)
* Made with JavaScript. Works compatibly with all major web browsers on Mac/PC/smartphones.



### Table of Contents

1. [How to Setup & Read/Publish EPUB Books](#how-to-setup--readpublish-epub-books) (for Users/Publishers)
2. [How to Arrange Development Environment](#how-to-arrange-development-environment) (for Developers)
3. [License](#license)
4. [Special Thanks](#special-thanks)




--------------------------------------------------------------------------------------------------------------------------------




How to Setup & Read/Publish EPUB Books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports 3 ways to read/publish EPUB books:

* Read in browsers on your local machine.
* Publish on the web to have your books read by someone.
* Open to the public as an online EPUB viewer for visitors' local EPUBs.

In all cases,

1. Download BiB/i from [GitHub release page](https://github.com/satorumurmur/bibi/releases) or [BiB/i website](https://bibi.epub.link/#download).
2. And unzip it at first.



### Read in browsers on your local machine 

1. Open `bib/i/index.html` in your browser, and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### Publish on the web

[Demo](https://bibi.epub.link/#demo).

You can publish both unzipped folder and zipped EPUB archive.

Using unzipped folder is recommended for the book which is heavy or contains many files.
Using zipped EPUB file is recommended for the book which is light or contains less files.



#### Publish unzipped folders

1. Upload `bib` folder on your web server.
2. Unzip an EPUB book,
    1. Change the file extension from `.epub` to `.zip` (`BOOKNAME.epub` -> `BOOKNAME.zip`), and
    2. Unzip the file with some tool.
3. Upload the unzipped folder `BOOKNAME` into `bib/bookshelf` directory, and
4. Access to `https://your.web.site/somewhere/bib/i/?book=BOOKNAME` by your browser. (note that it has no extension)
5. Or embed code below into your blog entry or other webpages, and visit the entry.

````
<a href="https://your.web.site/somewhere/bib/i/?book=BOOKNAME" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i frame, as you like ]]">My Great Book Title</a><script src="https://your.web.site/bib/i.js"></script>
````


#### Publish zipped EPUB files

1. Upload `bib` folder on your web server.
2. Upload your EPUB book (ex. `BOOKNAME.epub`) to `bib/bookshelf` directory, and
3. Access to `https://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub` by your browser.
4. Or embed code for it.

````
<a href="https://your.web.site/somewhere/bib/i/?book=BOOKNAME.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i frame, as you like ]]">My Great Book Title</a><script src="https://your.web.site/bib/i.js"></script>
````


#### Open to the public as an online EPUB viewer for visitors' local EPUBs

1. Upload `bib` folder on your web server.
2. Navigate visitors to `https://your.web.site/somewhere/bib/i`.
3. Visitors can read one's local EPUBs by draging and dropping EPUBs into the window.

If you want to terminate this feature, set "no" to "accept-files" in `bib/i/presets/default.js`.



How to Arrange Development Environment
--------------------------------------------------------------------------------------------------------------------------------



### Requirements

* [Node.js + npm](https://nodejs.org/en/)
    - [Downloads](https://nodejs.org/en/download/)
    - [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/).



### Arrangements

1. Clone [this repository](https://github.com/satorumurmur/bibi/). 
2. `$ cd <the local repository>`
3. `$ npm install`



### Development

1. `$ npm start`
    - Distribution files are generated/updated.
    - Local webserver is launched and your browser opens `http://localhost:61671/bib/i/?book=`.
2. Edit source files.
    - Distribution files are updated.
    - Your browser is reloaded.

* SCSS source file(s) of...
    - `bib/i/res/styles/bibi.css` are in `dev-bib/i/res/styles/`,
    - `bib/i.css` is `dev-bib/i.scss`.
* JavaScript source file(s) of...
    - `bib/i/res/scripts/bibi.js` are in `dev-bib/i/res/scripts/` (and `bower_components/`),
    - `bib/i.js` is `dev-bib/i.js`,
    - the extensions in `bib/i/extensions/` are in `dev-bib/i/extensions/`.

* These files are not processed by gulp tasks:
    - `bib/i/index.html`
    - Files in `bib/i/presets/`
    - Files in `bib/bookshelf/`




License
--------------------------------------------------------------------------------------------------------------------------------


### BiB/i

* Copyright &copy; Satoru MATSUSHIMA - https://bibi.epub.link/ or https://github.com/satorumurmur/bibi
* Licensed under the [MIT license](https://opensource.org/licenses/mit-license.php). - https://opensource.org/licenses/mit-license.php


### BiB/i is including and powered by these open source softwares:

* [Native Promise Only](https://github.com/getify/native-promise-only) ... Copyright &copy; Kyle Simpson (Licensed under the [MIT license](https://opensource.org/licenses/mit-license.php).)
* [easing.js](https://github.com/danro/easing-js) ... Copyright &copy; Dan Rogers (Licensed under the [MIT license](https://danro.mit-license.org).)
* [JSZip](http://stuk.github.io/jszip) ... Copyright &copy; Stuart Knightley (Dual licensed under the [MIT license](https://opensource.org/licenses/mit-license.php) or GPLv3.)
* [JSZipUtils](http://stuk.github.io/jszip-utils) ... Copyright &copy; Stuart Knightley (Dual licensed under the the [MIT license](https://opensource.org/licenses/mit-license.php) or GPLv3.)
* [JS-YAML](http://nodeca.github.io/js-yaml/) ... Copyright &copy; Vitaly Puzrin (Licensed under the [MIT license](https://opensource.org/licenses/mit-license.php).)
* [sML](https://github.com/satorumurmur/sML) ... Copyright &copy; Satoru MATSUSHIMA (Licensed under the [MIT license](https://opensource.org/licenses/mit-license.php).)
* [Material Icons](https://material.io/icons/) ... Copyright &copy; Material Design Authors / Google Inc. (Licensed under the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).)
* [Font Awesome Free](https://fontawesome.com) ... Copyright &copy; Dave Gandy (Licensed under the [SIL Open Font License (OFL) 1.1](https://scripts.sil.org/OFL))




Special Thanks
--------------------------------------------------------------------------------------------------------------------------------

* KITAITI Makoto ... [@KitaitiMakoto](https://github.com/KitaitiMakoto)
* Shunsuke ITO ... [@shunito](https://github.com/shunito)
