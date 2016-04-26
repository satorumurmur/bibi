Bibi.Preset = {

// =================================================================================================

"preset-name"                : "Default", // Name of this preset. As you like.
"preset-description"         : "Default Preset for BiB/i.", // Description for this preset. As you like.
"preset-author"              : "Satoru MATSUSHIMA", // Name of the author of this preset. As you like.
"preset-author-href"         : "http://bibi.epub.link", // URI of a website, etc. of the author of this preset. As you like.

// -------------------------------------------------------------------------------------------------

"bookshelf"                  : "../bookshelf/", // relative path from bib/i/index.html (if the origin is included in "trustworthy-origins", URI begins with "http://" or "https://" for COR-allowed server is OK).

"reader-view-mode"           : "paged", // "paged" or "vertical" or "horizontal" ("paged" is for flipping, "vertical" and "horizontal" are for scrolling)

"fix-reader-view-mode"       : "no", // "yes" or "no" or "desktop" or "mobile"
"autostart"                  : "no", // "yes" or "no" or "desktop" or "mobile"
"start-in-new-window"        : "mobile", // "yes" or "no" or "desktop" or "mobile"
"use-slider"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-arrows"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-keys"                   : "desktop", // "yes" or "no" or "desktop" or "mobile"
"use-swipe"                  : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-cookie"                 : "yes", // "yes" or "no" or "desktop" or "mobile"

"cookie-expires"             : 60 * 60 * 24 * 3, // seconds (60 * 60 * 24 * 3 = 3days)

"ui-font-family"             : "", // CSS font-family value as "'Helvetica', sans-serif" or ""

// -------------------------------------------------------------------------------------------------

"book-background"            : "", // CSS background value or ""

"spread-gap"                 : 2, // px
"spread-margin"              : 0, // px

"spread-border-radius"       : "", // CSS border-radius value or ""
"spread-box-shadow"          : "", // CSS box-shadow value or ""

"item-padding-left"          : 28, // px
"item-padding-right"         : 28, // px
"item-padding-top"           : 40, // px
"item-padding-bottom"        : 20, // px

"flipper-width"              : 0.3, // ratio (lower than 1) or px (1 or higher)

"page-breaking"              : false, // true or false (if it is true, CSS "page-break-before/after: always;" will work, partially)

"epub-additional-stylesheet" : "", // path from spine-item or http:// URI or ""
"epub-additional-script"     : "", // path from spine-item or http:// URI or ""

// =================================================================================================

"extensions": [
    { "name": "Unzipper", "src": "extensions/unzipper/unzipper.js" }, // if the browser is Internet Explorer, this is always inactive
    { "name": "Analytics", "src" : "extensions/analytics/analytics.js", "tracking-id": "" }, // "tracking-id": Your own Google Analytics tracking id, as "UA-********-*"
    { "name": "Share", "src" : "extensions/share/share.js" },
    //{ "name": "EPUBCFI", "src": "extensions/epubcfi/epubcfi.js" },
    //{ "name": "OverReflow", "src": "extensions/overreflow/overreflow.js" },
    //{ "name": "JaTEx", "src": "extensions/jatex/jatex.js" },
    // ------------------------------------------------------------------------------------------
    { "name": "Bibi", "4U" : "w0" } // (*'-'*)
],

// =================================================================================================

"trustworthy-origins": []

// =================================================================================================

};