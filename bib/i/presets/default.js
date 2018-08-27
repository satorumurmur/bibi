Bibi.Preset = {

// =================================================================================================

"preset-name"                  : "Default", // Name of this preset. As you like.
"preset-description"           : "Default Preset for BiB/i.", // Description for this preset. As you like.
"preset-author"                : "Satoru MATSUSHIMA", // Name of the author of this preset. As you like.
"preset-author-href"           : "https://bibi.epub.link", // URI of a website, etc. of the author of this preset. As you like.

// =================================================================================================

"bookshelf"                    : "../bookshelf", // Relative path of a directory from bib/i/index.html (to use path begins with "http(s)://", read <01> at the bottom of this preset file)

"reader-view-mode"             : "paged", // "paged" or "vertical" or "horizontal" ("paged" is for flipping, "vertical" and "horizontal" are for scrolling)
"fix-reader-view-mode"         : "no", // "yes" or "no" or "desktop" or "mobile"
"single-page-always"           : "no", // "yes" or "no" or "desktop" or "mobile"

"autostart"                    : "yes", // "yes" or "no" or "desktop" or "mobile"
"autostart-embedded"           : "no", // "yes" or "no" or "desktop" or "mobile" (It takes priority over "autostart" when the book is embedded in a webpage)
"start-embedded-in-new-window" : "mobile", // "yes" or "no" or "desktop" or "mobile" (It is used only when "autostart" (or "autostart-embedded") is NOT enabled)

"use-menubar"                  : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-nombre"                   : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-slider"                   : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-arrows"                   : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-keys"                     : "desktop", // "yes" or "no" or "desktop" or "mobile"
"use-swipe"                    : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-cookie"                   : "yes", // "yes" or "no" or "desktop" or "mobile"

"cookie-expires"               : 1000 * 60 * 60 * 24 * 31, // milli-seconds (ex. 31days = 1000(milli-seconds) * 60(seconds) * 60(minutes) * 24(hours) * 31(days))

"ui-font-family"               : "", // CSS font-family value as "'Helvetica', sans-serif" or ""

// -------------------------------------------------------------------------------------------------

"use-full-height"              : "yes", // "yes" or "no" or "desktop" or "mobile"

"book-background"              : "", // CSS background value or ""

"spread-gap"                   : 2, // px
"spread-margin"                : 0, // px

"spread-border-radius"         : "", // CSS border-radius value or ""
"spread-box-shadow"            : "", // CSS box-shadow value or ""

"item-padding-left"            : 28, // px
"item-padding-right"           : 28, // px
"item-padding-top"             : 40, // px
"item-padding-bottom"          : 20, // px

"flipper-width"                : 0.3, // Ratio (lower than 1), or pixel-number (1 or higher)

"preprocess-html-always"       : "no", // "yes" or "no" or "desktop" or "mobile"

"epub-additional-stylesheet"   : "", // Path from spine-item or URI begins with "http(s)://" or ""
"epub-additional-script"       : "", // Path from spine-item or URI begins with "http(s)://" or ""

// =================================================================================================

"extensions": [
    { "name": "Analytics", "src" : "extensions/analytics/analytics.js", "tracking-id": "" }, // "tracking-id": Your own Google Analytics tracking id, as "UA-********-*"
    { "name": "FontSize", "src": "extensions/fontsize/fontsize.js", "base": "auto", "scale-per-step": 1.25 }, // "base": "auto" or pixel-number
    { "name": "Loupe", "src": "extensions/loupe/loupe.js", "mode": "", "max-scale": 4 },
    { "name": "Share", "src" : "extensions/share/share.js" },
    //{ "name": "EPUBCFI", "src": "extensions/epubcfi/epubcfi.js" },
    //{ "name": "Unaccessibilizer", "src": "extensions/unaccessibilizer/unaccessibilizer.js", "select-elements": "prevent", "save-images": "prevent", "use-contextmenu": "prevent" },
    // ------------------------------------------------------------------------------------------
    { "name": "Bibi", "4U" : "w/0" } // (*'-'*)
],

// =================================================================================================

"website-name-in-title"        : "", // "" or name of your website replaces string "BiB/i" in <title>.

"website-name-in-menu"         : "", // "" or name of your website appears in setting-menu as a link. (Requires "website-href")
"website-href"                 : "", // "" or URL of your website to be used for the link in setting-menu. (Requires "website-name-in-menu")

"remove-bibi-website-link"     : false, // true or false (if true, the link to BiB/i Website is not to be added in setting-menu)

// -------------------------------------------------------------------------------------------------

"unzip-if-necessary"           : [".epub", ".zip"], // File extensions of the book specified in URL, which you want BiB/i to try unzipping first. More info is <02> at the bottom of this preset file)

"accept-bibizine"              : true, // true or false (If true, BiB/i accepts EPUB-like bibiZine formated book. If you are interested in it, please contact the author)
"accept-blob-converted-data"   : true, // true or false (If true, BiB/i accepts BLOB object converted from a EPUB File. If you are interested in it, please contact the author)
"accept-base64-encoded-data"   : true, // true or false (If true, BiB/i accepts Base64 string encoded from a EPUB File. If you are interested in it, please contact the author)
"accept-local-file"            : "yes", // "yes" or "no" or "desktop" or "mobile". (If it is enabled, BiB/i prepares UI for loading files. Conditions for acceptance are <03> at the bottom of this preset file)


// -------------------------------------------------------------------------------------------------

"trustworthy-origins"          : []

// =================================================================================================

};

/*


## <01> You can use a path begins with "http(s)://" for "bookshelf" in cases of the below:

    * The origin of the path defined in the "bookshelf" option is same as the origin of this BiB/i.
    * [OR] The origin of "bookshelf" is included in "trustworthy-origins"
        - [AND] The origin allows COR from the origin of this BiB/i.


## <02> BiB/i tries to unzip at first in cases of the below:

    * The "unzip-if-necessary" option includes "*".
    * [OR] The "unzip-if-necessary" option includes one or more file extensions.
        - [AND] The book name specified as a value of the `book` (or `zine`) query in URL has a file extension.
        - [AND] The file extension of the book name is included in the "unzip-if-necessary" option.
    * [OR] The "unzip-if-necessary" option is "".
        - [AND] The book name specified as a value of the `book` (or `zine`) query in URL has no file extension.

    ### Note:
    * If BiB/i failed to unzip it, automatically tries to load as a folder (directory).
    * The "unzip-if-necessary" option affects also as conditions for acceptance of local file. Read <03> at the next.


## <03> BiB/i accepts user's local file in cases of the below:

    * The file is an EPUB.
        - [AND] The extension of the file is ".epub".
        - [AND] The "unzip-if-necessary" option includes ".epub" or "*".
        - [AND] The MIME-Type sent from the browser is "application/epub+zip".
    * [OR] The file is a bibiZine.
        - [AND] The extension of the file is ".zip".
        - [AND] The "unzip-if-necessary" includes ".zip" or "*".
        - [AND] The MIME-Type sent from the browser is "application/zip", "application/x-zip", or "application/x-zip-compressed".

    ### Note:
    * Extension of the file is required even if "unzip-if-necessary" is "" (or includes "*").


*/