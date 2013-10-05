BiB/i
====

EPUB Reader on Your Site.


How to setup
------------

BiB/i supports two ways to read EPUB books:

* in browser on your local machine and
* via web.

In either case, download BiB/i from [here](http://sarasa.la/bib/i/#download) and
unzip it at first.


Read EPUB books in browser
--------------------------

1. Open `bib/i/index.html` in your browser and
2. drag an EPUB book and drop it into the window.
3. That's all!


Read EPUB books via web
-----------------------

Demo is [here](http://sarasa.la/bib/i/#demo).

1. Upload `bib` directory to your web server,
2. upload your EPUB books(for instance, `my-book.epub` here) to `bib/bookshelf` directory and
3. access to `http://your.web.site/bib/i/?book=my-book.epub` by your browser.
4. Or embed code below into your blog and visit the blog entry.

```
<a href="http://your.web.site/somewhere/bib/i/?book=my-book.epub" data-bibi="embed" data-bibi-style="CSS as you like">my-book.epub</a><script src="http://your.web.site/bib/i.js"></script>
```

Read EPUB books as unzipped archives
------------------------------------

You may also read EPUB books as unzipped archives, or by page-by-page access, by uploading unzipped EPUB books to `bookshelf` directory.
This is recommended because it accelarates reading experience of your readers.

1. Unzip an EPUB book,
  1. Change the file extension from `.epub` to `.zip`(`my-book.epub` -> `my-book.zip`) and then
  2. unzip the file with some tool.
2. upload it to `bib/bookshelf` directory, and
3. visit `http://your.web.site/bib/i/?book=my-book`(note that it has *no extension*) or embed code for it.
