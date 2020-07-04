Bibi
================================================================================================================================

EPUB Reader on your website.




Summary
--------------------------------------------------------------------------------------------------------------------------------

You can publish EPUB books on the web, with full-featured viewer running on web browser.
And you can embed it in other webpages (like YouTube videos).



### Spec.

* EPUB 3+ and 2 compliant. Supports both reflowable and fixed-layout books of various language.
* Made with JavaScript. Works compatibly with all major web browsers on various OS/devices.
* Free. Open source software released under the MIT License.



### Table of Contents

1. [How to Setup &amp; Read/Publish EPUB Books](#how-to-setup--readpublish-epub-books) (for Users/Publishers)
2. [How to Arrange Development Environment](#how-to-arrange-development-environment) (for Developers)
3. [License](#license)
4. [Special Thanks](#special-thanks)
5. [Supported by](#supported-by)




--------------------------------------------------------------------------------------------------------------------------------




How to Setup &amp; Read/Publish EPUB Books
--------------------------------------------------------------------------------------------------------------------------------

Bibi supports 3 ways to read/publish EPUB books:

* Read in browsers on your offline machine.
* Publish on the web to have your books read by someone.
* Use as an online EPUB viewer for your or visitors' local EPUBs.

In all cases,

1. Download Bibi from [GitHub release page](https://github.com/satorumurmur/bibi/releases) or [Bibi website](https://bibi.epub.link/#download).
2. And unzip it at first.



### Are you an user of BiB/i older than v1.0.0? 

The folder structure and default public URL has changed in Bibi v1.0.0.
But don't worry. You still can use not only the new style URL but also the same old style URL as before.

If you already published books on the web with BiB/i which version is older than v1.0.0, and want to update Bibi to v1.0.0 or newer, but do not want to change the public URLs of the books,

* Please download `Bibi-vX.Y.Z_with_BackCompatKit.zip`, and follow the document in it.



### Read in browsers on your local machine 

1. Open `bibi/index.html` in your browser, and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### Publish on the web

[Demo](https://bibi.epub.link/#demo).

You can publish both unzipped folder and zipped EPUB archive.

Using unzipped folder is recommended for the book which is heavy or contains many files.
Using zipped EPUB file is recommended for the book which is light and contains less files.

In both ways, at first, upload `bibi` and 'bibi-bookshelf' folders to the same directory on your web server.
`bibi` contains all programs of Bibi, and 'bibi-bookshelf' is for the storage of the books you upload.
You can use different directory for the bookshelf instead of 'bibi-bookshelf' by editing "bookshelf" option in 'bibi/presets/default.js'.


#### Publish unzipped folders

1. Upload `bibi` and 'bibi-bookshelf' folders to the same directory on your web server.
2. Unzip an EPUB book,
    1. Change the file extension from `.epub` to `.zip` (`BOOKNAME.epub` -> `BOOKNAME.zip`), and
    2. Unzip the file with some tool.
3. Upload the unzipped folder `BOOKNAME` into `bibi-bookshelf` directory, and
4. Access to `https://your.web.site/somewhere/bibi/?book=BOOKNAME` by your browser. (note that it has no extension)
5. Or embed code below into your blog entry or other webpages, and visit the entry.

````
<a href="https://your.web.site/somewhere/bibi/?book=BOOKNAME" data-bibi="embed" data-bibi-style="[[ CSS for embeded Bibi frame, as you like ]]">[[ Title of the Book ]]</a><script src="https://your.web.site/somewhere/bibi/and/jo.js"></script>
````


#### Publish zipped EPUB files

1. Upload `bibi` and 'bibi-bookshelf' folders to the same directory on your web server.
2. Upload your EPUB book (ex. `BOOKNAME.epub`) to `bibi-bookshelf` directory, and
3. Access to `https://your.web.site/somewhere/bibi/?book=BOOKNAME.epub` by your browser.
4. Or embed code below into your blog entry or other webpages, and visit the entry.

````
<a href="https://your.web.site/somewhere/bibi/?book=BOOKNAME.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded Bibi frame, as you like ]]">[[ Title of the Book ]]</a><script src="https://your.web.site/somewhere/bibi/and/jo.js"></script>
````


### Use as an online EPUB viewer

1. Upload `bibi` folder on your web server.
2. Navigate visitors to `https://your.web.site/somewhere/bibi/`.
3. Visitors can read one's local EPUBs by draging and dropping EPUBs into the window.

If you want to terminate this feature, set "no" to "accept-files" in `bibi/presets/default.js`.




How to Arrange Development Environment
--------------------------------------------------------------------------------------------------------------------------------



### Requirements

* [Node.js + npm](https://nodejs.org/en/)
    - [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/).
    - Or [Downloads](https://nodejs.org/en/download/)
* Windows development requires additional tools(Python + Visual C++ Build Environment). For more information consult the [documentation](https://github.com/nodejs/node-gyp#on-windows)



### Arrangements

1. Clone [this repository](https://github.com/satorumurmur/bibi/). 
2. $ `cd <the local repository>`
3. $ `npm install`



### How to Develop

1. $ `npm start`
    1. webpack generates development version of Bibi to `__dist` folder, and start to watch changes of the files in `__src` folder.
    2. BrowserSync webserver launches and navigate your browser to `http://localhost:61671/bibi/?book=`.
2. Edit source files.
    1. If you modify source files in `__src` folder, development version of the file(s) are updated in `__dist` folder automaticaly.
    2. BrowserSync reloads your browser(s) or inject changes of CSS.

Files in `__dist` folder generated with `npm start` are development version.
Please don't forget to run `npm run build` and build production version before you upload.

| Distribution                            | Source                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `__dist/bibi/*.html`                    | `__src/bibi/*.html`                                                                                   |
| `__dist/bibi/and/jo.js`                 | `__src/bibi/and/jo.js` + `__src/bibi/and/jo.scss`                                                     |
| `__dist/bibi/extensions/**`             | `__src/bibi/extensions/**`                                                                            |
| `__dist/bibi/presets/*.js`              | `__src/bibi/presets/*.js`                                                                             |
| `__dist/bibi/resources/scripts/bibi.js` | `__src/bibi/resources/scripts/*.js` + `__src/bibi/resources/scripts/bibi.book.scss`                   |
| `__dist/bibi/resources/styles/bibi.css` | `__src/bibi/resources/styles/*.scss`                                                                  |
| `__dist/bibi/wardrobe/**/*.css`         | Read documents in `__src/bibi/wardrobe/README-DRESS_ja` (Sorry..., currently README is Japanese only) |

Files in the `Distribution` column of the table are overwritten with the files updated by `npm start` or `npm run build`.
If you want to modify them, please edit files in the `Source` column instead of editing these files in `__dist` directly.


### How to Build

* $ `npm run build`
    - webpack generates production version of Bibi to `__dist` folder.
    - You can upload them to your online webserver.


### How to Make a Ditribution Package

* $ `npm run make:package`
    1. webpack generates temporary files of production version of Bibi.
    2. gulp generates zipped archive to `__archives` folder. After that, the temporary files are removed.




License
--------------------------------------------------------------------------------------------------------------------------------



### Bibi ([ja](https://bibi.epub.link) / [en](https://github.com/satorumurmur/bibi))

* © [Satoru Matsushima](https://string-letters.com) ([@satorumurmur](https://twitter.com/satorumurmur))
* Open source under [the MIT License](https://github.com/satorumurmur/bibi/blob/master/LICENSE)



### Bibi is including and powered by these open source softwares:

* Core:
    - [sML.js](https://github.com/satorumurmur/sML) : © Satoru Matsushima / Licensed under [the MIT License](https://github.com/satorumurmur/sML/blob/master/LICENSE)
* UI:
    - [Material Icons](https://material.io/icons/) : © Material Design Authors &amp; Google Inc. / Licensed under [the Apache License version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
* Extensions:
    - [Bibi Zip Loader](https://github.com/lunascape/bibi-zip-loader) : © Lunascape / Licensed under [the MIT License](https://github.com/lunascape/bibi-zip-loader/blob/master/LICENSE)
    - [DOMPurify](https://github.com/cure53/DOMPurify) : © Mario Heiderich / Dual licensed under [the Apache License Version 2.0 or the Mozilla Public License Version 2.0](https://github.com/cure53/DOMPurify/blob/master/LICENSE)
    - [JSZip](http://stuk.github.io/jszip) : © Stuart Knightley / Dual licensed under [the MIT License or the GPLv3](https://github.com/Stuk/jszip/blob/HEAD/LICENSE.markdown)
    - [JSZipUtils](http://stuk.github.io/jszip-utils) : © Stuart Knightley / Dual licensed under [the MIT License or the GPLv3](https://github.com/Stuk/jszip-utils/blob/master/LICENSE.markdown)
    - [JS-YAML](http://nodeca.github.io/js-yaml/) : © Vitaly Puzrin / Licensed under [the MIT License](https://github.com/nodeca/js-yaml/blob/master/LICENSE)
* Polyfills:
    - [classlist-polyfill](https://github.com/yola/classlist-polyfill) : by Yola Inc. / Released into the public domain under [the Unlicense](https://github.com/yola/classlist-polyfill/blob/master/LICENSE)
    - [text-encoding-utf-8](https://github.com/arv/text-encoding-utf-8) : by Erik Arvidsson / Released into the public domain under [the Unlicense](https://github.com/arv/text-encoding-utf-8/blob/master/LICENSE.md)
    - [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver) : © W3C / Licensed under [the W3C Software and Document License](https://github.com/w3c/IntersectionObserver/blob/master/LICENSE.md)
    - [custom-event-polyfill](https://github.com/kumarharsh/custom-event-polyfill) : © Evan Krambuhl / Licensed under [the MIT License](https://github.com/kumarharsh/custom-event-polyfill/blob/master/LICENSE)
    - [document.currentScript Polyfill](https://github.com/amiller-gh/currentScript-polyfill) : © Adam Miller / Licensed under [the MIT License](https://github.com/amiller-gh/currentScript-polyfill/blob/master/LICENSE)
    - [ES6 Object.assign()](https://github.com/rubennorte/es6-object-assign) : © Rubén Norte / Licensed under [the MIT License](https://github.com/rubennorte/es6-object-assign/blob/master/LICENSE)
    - [Native Promise Only (NPO)](https://github.com/getify/native-promise-only) : © Kyle Simpson / Licensed under [the MIT License](http://getify.mit-license.org/)
    - [Polyfill Array.prototype.includes](https://github.com/latusinski/polyfill-array-includes) : © Kevin Latusinski / Licensed under [the MIT License](https://www.npmjs.com/package/polyfill-array-includes)
    - [String.prototype.padStart](https://github.com/KhaledElAnsari/String.prototype.padStart) : © Khaled Al-Ansari / Licensed under [the MIT License](https://github.com/KhaledElAnsari/String.prototype.padStart/blob/master/LICENSE)
    - [url-polyfill](https://github.com/lifaon74/url-polyfill) : © Valentin Richard / Licensed under [the MIT License](https://github.com/lifaon74/url-polyfill/blob/master/LICENSE)




Special Thanks
--------------------------------------------------------------------------------------------------------------------------------

Thanks to the contributors and the users around the world!




Supported by
--------------------------------------------------------------------------------------------------------------------------------



### [Media Do Co.,Ltd](https://www.mediado.jp)

* Bibi v1.2.0 was developed with the huge support and many feedbacks from Media Do Co.,Ltd.



### [Lunascape](https://www.lunascape.tv)

* Bibi v1.0.0 was developed with greateful support and sponsoring from Lunascape.
* Lunascape also developed [Bibi Zip Loader](https://github.com/lunascape/bibi-zip-loader) especially for Bibi, which realized fast progressive loading of zipped EPUBs.



