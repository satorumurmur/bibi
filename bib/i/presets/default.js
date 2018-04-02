Bibi.Preset = {

// =================================================================================================

"preset-name"                : "Default", // Name of this preset. As you like.
"preset-description"         : "Default Preset for BiB/i.", // Description for this preset. As you like.
"preset-author"              : "Satoru MATSUSHIMA", // Name of the author of this preset. As you like.
"preset-author-href"         : "http://bibi.epub.link", // URI of a website, etc. of the author of this preset. As you like.

// -------------------------------------------------------------------------------------------------

"website-name-in-title"      : "", // "" or name of your website replaces string "BiB/i" in <title>.

"website-name-in-menu"       : "", // "" or name of your website appears in setting-menu as a link. (Requires "website-href")
"website-href"               : "", // "" or URL of your website to be used for the link in setting-menu. (Requires "website-name-in-menu")

"remove-bibi-website-link"   : false, // true or false (if true, the link to BiB/i Website is not to be added in setting-menu)

// -------------------------------------------------------------------------------------------------

"bookshelf"                  : "../bookshelf/", // relative path from bib/i/index.html (if the origin is included in "trustworthy-origins", URI begins with "http://" or "https://" for COR-allowed server is OK).

"reader-view-mode"           : "paged", // "paged" or "vertical" or "horizontal" ("paged" is for flipping, "vertical" and "horizontal" are for scrolling)
"fix-reader-view-mode"       : "no", // "yes" or "no" or "desktop" or "mobile"
"single-page-always"         : "no", // "yes" or "no" or "desktop" or "mobile"

"autostart"                  : "no", // "yes" or "no" or "desktop" or "mobile"
"start-in-new-window"        : "mobile", // "yes" or "no" or "desktop" or "mobile"

"use-full-height"            : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-menubar"                : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-nombre"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-slider"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-arrows"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-keys"                   : "desktop", // "yes" or "no" or "desktop" or "mobile"
"use-swipe"                  : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-cookie"                 : "yes", // "yes" or "no" or "desktop" or "mobile"

"cookie-expires"             : 1000 * 60 * 60 * 24 * 3, // milli-seconds (ex. 1000ms * 60s * 60m * 24h * 3d = 3days)

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

"preprocess-html-always"     : "no", // "yes" or "no" or "desktop" or "mobile"

"page-breaking"              : false, // true or false (if true, CSS "page-break-before/after: always;" will work, partially)

"epub-additional-stylesheet" : "", // path from spine-item or http:// URI or ""
"epub-additional-script"     : "", // path from spine-item or http:// URI or ""

// =================================================================================================

"extensions": [
    { "name": "Unzipper", "src": "extensions/unzipper/unzipper.js" },
    { "name": "Analytics", "src" : "extensions/analytics/analytics.js", "tracking-id": "" }, // "tracking-id": Your own Google Analytics tracking id, as "UA-********-*"
    { "name": "FontSize", "src": "extensions/fontsize/fontsize.js", "base": "auto", "scale-per-step": 1.25 }, // "base": "auto" or pixel-number (if you want to change the default font-size based on the size used most frequently in each HTML)
    { "name": "Loupe", "src": "extensions/loupe/loupe.js", "mode": "", "max-scale": 4 },
    { "name": "Share", "src" : "extensions/share/share.js" },
    //{ "name": "EPUBCFI", "src": "extensions/epubcfi/epubcfi.js" },
    //{ "name": "OverReflow", "src": "extensions/overreflow/overreflow.js" },
    //{ "name": "JaTEx", "src": "extensions/jatex/jatex.js" },
    //{ "name": "Unaccessibilizer", "src": "extensions/unaccessibilizer/unaccessibilizer.js", "select-elements": "prevent", "save-images": "prevent", "use-contextmenu": "prevent" },
    // ------------------------------------------------------------------------------------------
    { "name": "Bibi", "4U" : "w/0" } // (*'-'*)
],

// =================================================================================================

"trustworthy-origins": []

// =================================================================================================

};