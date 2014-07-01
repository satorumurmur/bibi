BiB/i
================================================================================================================================

EPUB Reader on Your Web Site.

1. How to setup & read/publish EPUB books (for users)
2. How to arrange development environment (for developers)




1. How to setup & read/publish EPUB books
--------------------------------------------------------------------------------------------------------------------------------

BiB/i supports two ways to read/publish EPUB books:

1. Read in browsers on your local machine, or
2. Publish on the web, to have your books read by someone.

In either case, download BiB/i from [web site](http://sarasa.la/bib/i/#download) and unzip it at first.



### 1-1. Read in browsers on your local machine

1. Open `bib/i/index.html` in your browser and
2. Drag an EPUB book and drop it into the window.
3. That's all!



### 1-2. Publish on the web

[Demo](http://sarasa.la/bib/i/#demo).

You can publish both zipped/unzipped archive.
But to use unzipped archive is highly recommended.


#### 1-2-1. Use zipped archives

1. Upload `bib` directory to your web server,
2. Upload your EPUB books(for instance, `my-book.epub` here) to `bib/bookshelf` directory, and
3. Access to `http://your.web.site/bib/i/?book=my-book.epub` by your browser.
4. Or embed code below into your blog and visit the blog entry.

```
<a href="http://your.web.site/somewhere/bib/i/?book=my-book.epub" data-bibi="embed" data-bibi-style="[[ CSS for embeded BiB/i, as you like ]]">My Great Book Title</a><script src="http://your.web.site/bib/i.js"></script>
```


#### 1-2-2. Use unzipped archives (recommended)

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

* [Node.js + npm](http://nodejs.org/) - how to install: [Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) (or [Download the installer](http://nodejs.org/download/))
* [Ruby](https://www.ruby-lang.org/) (+ [RubyGems](http://guides.rubygems.org/)) - how to install: [Installing Ruby](https://www.ruby-lang.org/en/installation/) (+ [RubyGems Basics](http://guides.rubygems.org/rubygems-basics/))
* [Compass](http://compass-style.org/) (+ [Sass](http://sass-lang.com/)) - how to install: `$ gem update --system && gem install compass`
* [Grunt](http://gruntjs.com/) - how to install: `$ npm install -g grunt-cli` ... ([Getting Started](http://gruntjs.com/getting-started))


#### Arrangements

1. Clone this repository.
2. `$ cd <the repository>`
3. `$ npm install` then `npm-modules` directory including modules will be installed.


#### Development

1. `$ grunt` and start watching changes of files, and make these files:
    * `bib/i/res/scripts/bibi.lib.js`
    * `bib/i/res/scripts/bibi.js`
    * `bib/i/res/styles/bibi.css`
2. Edit files.
    * Sources of the `bib/i/res/scripts/bibi.lib.js` are in `bib/i/res/scripts/lib/`.
    * Sources of the `bib/i/res/scripts/bibi.js` are in `bib/i/res/scripts/src/`.
    * Sources of the `bib/i/res/styles/bibi.css` are in `bib/i/res/styles/src/`.

Following files are not watched or processed by Grunt tasks:

* `bib/i.js` (to embed in HTML)
* `bib/i.css` (to style embedded HTML elements of BiB/i)
* `bib/manifest.json` (to use as Chrome application)
* `bib/i/index.html` (as portal)
* `bib/i/res/loader.js` (to load scripts and styles for index.html)
* Files in `bib/presets/` (customisable settings and styles)
* Files in `bib/i/res/fonts/` (icon fonts)

And `bib/bookshelf/` directory is including `.gitkeep`







