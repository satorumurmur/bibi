BiB/i
================================================================================================================================

EPUB Reader on your website.




Summary
--------------------------------------------------------------------------------------------------------------------------------

You can publish EPUB books on the web with a permalink for each book, and you can embed it in other webpages (just like a YouTube video).



### Spec.

* EPUB 3+ and 2 compliant. Supports both fixed-layout and reflow books of various language.
* Made with JavaScript. Works compatibly with all major web browsers on various OS/devices.
* Open source software released under the MIT license.



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



### How to Develop

1. `$ npm start` (or `$ npm run develop:watch`)
    - webpack generates development version of files and watch change.
    - BrowserSync webserver launches and navigate your browser to `http://localhost:61671/bib/i/?book=`.
2. Edit source files.
    - webpack watches change and updates development version of the file you edited.
    - BrowserSync reloads your browser(s) or inject changes of CSS.

* SCSS source file(s) of...
    - `bib/i/res/styles/bibi.css` are in `dev-bib/i/res/styles/`,
    - Styles in `bib/i.js` is `dev-bib/i.scss`.
* JavaScript source file(s) of...
    - `bib/i/res/scripts/bibi.js` are in `dev-bib/i/res/scripts/`,
    - `bib/i.js` is `dev-bib/i.js`,
    - the extensions in `bib/i/extensions/` are in `dev-bib/i/extensions/`.

* These files are not processed by gulp tasks:
    - Index file `bib/i/index.html`
    - Preset file in `bib/i/presets/`
    - Files in `bib/bookshelf/`



### How to Build

* `$ npm run build` (or `$ npm run produce`)
    - webpack generates production version of files.



### How to Ditribute

* `$npm run distribute`
    1. webpack generates production version of files.
    2. gulp generates zipped archive.




License
--------------------------------------------------------------------------------------------------------------------------------


### [BiB/i](https://bibi.epub.link) ([en](https://github.com/satorumurmur/bibi))

* Copyright &copy; [Satoru MATSUSHIMA](https://string-letters.com) ([@satorumurmur](https://twitter.com/satorumurmur))
* Licensed under [the MIT license](https://github.com/satorumurmur/bibi/blob/master/LICENSE). - https://opensource.org/licenses/mit-license.php


### Distribution is including these open source softwares:

* Core components:
    - [sML.js](https://www.npmjs.com/package/sml.js) ... Copyright &copy; Satoru MATSUSHIMA (Licensed under [the MIT license](https://github.com/satorumurmur/sML/blob/master/LICENSE).)
    - [Material Icons](https://material.io/icons/) ... Copyright &copy; Material Design Authors / Google Inc. (Licensed under [the Apache license version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).)
    - [Font Awesome Free](https://fontawesome.com) ... Copyright &copy; Dave Gandy (Licensed under [the SIL Open Font License (OFL) 1.1](https://fontawesome.com/license/free).)
* Extensions:
    - [JSZip](http://stuk.github.io/jszip) ... Copyright &copy; Stuart Knightley (Dual licensed under [the MIT license or the GPLv3 license](https://github.com/Stuk/jszip/blob/HEAD/LICENSE.markdown).)
    - [JSZipUtils](http://stuk.github.io/jszip-utils) ... Copyright &copy; Stuart Knightley (Dual licensed under [the the MIT license or the GPLv3 license](https://github.com/Stuk/jszip-utils/blob/master/LICENSE.markdown).)
    - [JS-YAML](http://nodeca.github.io/js-yaml/) ... Copyright &copy; Vitaly Puzrin (Licensed under [the MIT license](https://github.com/nodeca/js-yaml/blob/master/LICENSE).)
* Polyfills (for Internet Explorer):
    - [Native Promise Only (NPO)](https://www.npmjs.com/package/native-promise-only) ... Copyright &copy; Kyle Simpson (Licensed under [the MIT license](http://getify.mit-license.org/).)
    - [custom-event-polyfill](https://www.npmjs.com/package/custom-event-polyfill) ... Copyright &copy; Evan Krambuhl (Licensed under [the MIT license](https://github.com/kumarharsh/custom-event-polyfill/blob/master/LICENSE).)
    - [document.currentScript Polyfill](https://www.npmjs.com/package/current-script-polyfill) ... Copyright &copy; Adam Miller (Licensed under [the MIT license](https://github.com/amiller-gh/currentScript-polyfill/blob/master/LICENSE).)
    - [Polyfill Array.prototype.includes](https://www.npmjs.com/package/polyfill-array-includes) ... Copyright &copy; Kevin Latusinski (Licensed under the MIT license.)
    - [String.prototype.padStart](https://www.npmjs.com/package/string.padstart) ... Copyright &copy; Khaled Al-Ansari (Licensed under [the MIT license](https://github.com/KhaledElAnsari/String.prototype.padStart/blob/master/LICENSE).)
    - [classlist-polyfill](https://www.npmjs.com/package/classlist-polyfill) ... by Yola Inc. (Released into the public domain under [the Unlicense](https://github.com/yola/classlist-polyfill/blob/master/LICENSE))


Special Thanks
--------------------------------------------------------------------------------------------------------------------------------

* [KITAITI Makoto](https://github.com/KitaitiMakoto)
* [Shunsuke ITO](https://github.com/shunito)
