Bibi.Preset = {

// =================================================================================================

"preset-name"                : "Default", // Name of this preset. As you like.
"preset-description"         : "Default Preset for BiB/i.", // Description for this preset. As you like.
"preset-author"              : "Satoru MATSUSHIMA", // Name of the author of this preset. As you like.
"preset-author-href"         : "http://bibi.epub.link", // URI of a website, etc. of the author of this preset. As you like.

// -------------------------------------------------------------------------------------------------

"bookshelf"                  : "../../bib/bookshelf/", // relative path from bib/i/index.html or COR-allowed URI begins with "http://" or "https://".

"reader-view-mode"           : "paged", // "paged" or "vertical" or "horizontal" ("paged" is for flipping, "vertical" and "horizontal" are for scrolling)

"reader-view-mode-fixed"     : "no", // "yes" or "no" or "desktop" or "mobile"
"autostart"                  : "no", // "yes" or "no" or "desktop" or "mobile"
"play-in-new-window"         : "mobile", // "yes" or "no" or "desktop" or "mobile"
"hide-arrows"                : "no", // "yes" or "no" or "desktop" or "mobile"

"ui-font-family"             : "", // CSS font-family value as "'Helvetica', sans-serif" or ""

// -------------------------------------------------------------------------------------------------

"book-background"            : "", // CSS background value or ""

"spread-gap"                 : 2, // px
"spread-margin"              : 0, // px

"spread-border-radius"       : "", // CSS border-radius value or ""
"spread-box-shadow"          : "", // CSS box-shadow value or ""

"item-padding-left"          : 28, // px
"item-padding-right"         : 28, // px
"item-padding-top"           : 36, // px
"item-padding-bottom"        : 20, // px

"page-breaking"              : false, // true or false (if it is true, CSS "page-break-before/after: always;" will work, partially)

"epub-additional-stylesheet" : "", // path from spine-item or http:// URI or ""
"epub-additional-script"     : "", // path from spine-item or http:// URI or ""

// =================================================================================================

"extensions": [
    { "name": "Unzipper", "src": "extensions/unzipper/unzipper.js" }, // if the browser is Internet Explorer, this is always inactive
    { "name": "Analytics", "src" : "extensions/analytics/analytics.js", "tracking-id": "" }, // "tracking-id": Your own Google Analytics tracking id, as "UA-********-*"
    //{ "name": "EPUBCFI", "src": "extensions/epubcfi/epubcfi.js" },
    //{ "name": "OverReflow", "src": "extensions/overreflow/overreflow.js" },
    //{ "name": "JaTEx", "src": "extensions/jatex/jatex.js" },
    // ------------------------------------------------------------------------------------------
    { "name": "Bibi", "4U" : "w0" } // (*'-'*)
]

// =================================================================================================

};