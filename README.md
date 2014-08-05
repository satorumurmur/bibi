BiB/i
================================================================================================================================

EPUB Reader on Your Web Site.

1. How to setup & read/publish EPUB books (for users)
2. How to arrange development environment (for developers)
3. License




1. How to setup & read/publish EPUB books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports two ways to read/publish EPUB books:

* Read in browsers on your local machine, or
* Publish on the web, to have your books read by someone.

In either case, download BiB/i from [web site](http://sarasa.la/bib/i/#download) and unzip it at first.



### Read in browsers on your local machine

1. Open `bib/i/index.html` in your browser and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### Publish on the web

[Demo](http://sarasa.la/bib/i/#demo).

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
    1. Change the file extension from `.epub` to `.zip`(`my-book.epub` -> `my-book.zip`) and then
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
3. [Bundler](http://bundler.io/) - how to install: `$ gem update --system && gem install bundler`
4. [Grunt](http://gruntjs.com/) - how to install: `$ npm install -g grunt-cli` ... (“[Getting Started](http://gruntjs.com/getting-started)”)


### Arrangements

1. Clone this repository.
2. `$ cd <the repository>`
3. `$ bundle install --path=vendor/bundle` then `vendor/bundle` directory including RubyGems(Compass and dependent gems) will be installed.
4. `$ npm install` then `npm-modules` directory including modules will be installed.


### Development

1. `$ grunt` and start watching changes of files, and make these files:
    * `bib/i/res/scripts/bibi.lib.js` ... sML.js + JSZip.js + base64.js
    * `bib/i/res/scripts/bibi.js` ... bibi.core.js + bibi.epubcfi.js
    * `bib/i/res/styles/bibi.css`
    * `bib/i/res/styles/pipi.css` ... Newly added. (formerly `bib/i.css`, for embedding BiB/i to webpage)
2. Edit files.
    * JavaScript sources of the `bib/i/res/scripts/bibi.lib.js` are in `bib/i/res/scripts/lib/`.
    * JavaScript sources of the `bib/i/res/scripts/bibi.js` are in `bib/i/res/scripts/src/`.
    * SCSS sources of the `bib/i/res/styles/bibi.css` are in `bib/i/res/styles/src/`.
    * SCSS sources of the `bib/i/res/styles/pipi.css` are in `bib/i/res/styles/src/`.

Following files are not watched or processed by Grunt tasks:

* `bib/i/index.html` (as portal)
* `bib/i.js` (to embed in HTML)
* `bib/manifest.json` (to use as Chrome application)
* Files in `bib/presets/` (customisable settings and styles)
* Files in `bib/i/res/fonts/` (icon fonts)

And `bib/bookshelf/` directory is including `.gitkeep`
```




3. License
--------------------------------------------------------------------------------------------------------------------------------


### BiB/i

#copy; Satoru MATSUSHIMA - http://sarasa.la/bib/i
Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php


### BiB/i is including these softwares

<dl>
	<dt><a href="http://stuartk.com/jszip">JSZip</a></dt><dd>&copy; Stuart Knightley (Dual licenced under the MIT license or GPLv3.)</dd>
	<dt><a href="https://github.com/dankogai/js-base64">base64.js</a></dt><dd>&copy; dankogai (Licensed under the MIT license.)</dd>
	<dt><a href="http://fortawesome.github.io/Font-Awesome/">Font Awesome 4.0.3</a></dt><dd>&copy; Dave Gandy (Licensed under SIL Open Font License.)</dd>
	<dt><a href="http://zurb.com/playground/foundation-icon-fonts-3">Foundation Icons v 3.0</a></dt><dd>&copy; ZURB (Licensed under the MIT license.)</dd>
	<dt><a href="http://sarasa.sm/sML">sML</a></dt><dd>&copy; Satoru MATSUSHIMA (Licensed under the MIT license.)</dd>
</dl>


