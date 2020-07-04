Bibi.preset({


//==============================================================================================================================================
//-- Bookshelf
//----------------------------------------------------------------------------------------------------------------------------------------------

"bookshelf" : "../../bibi-bookshelf", // Relative path from this preset file to the bookshelf directory. "/" at the end is ignored. (To use a path begins with "http(s)://", read <01> at the bottom of this preset file.)


//==============================================================================================================================================
//-- Behavior
//----------------------------------------------------------------------------------------------------------------------------------------------

"reader-view-mode"              : "paged", // "paged" or "horizontal" or "vertical" ("paged" is for flipping, "horizontal" and "vertical" are for scrolling)
"full-breadth-layout-in-scroll" : "no", // "yes" or "no" or "desktop" or "mobile"
"fix-reader-view-mode"          : "no", // "yes" or "no" or "desktop" or "mobile"

"keep-settings"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"resume-from-last-position"     : "yes", // "yes" or "no" or "desktop" or "mobile"

"autostart"                     : "yes", // "yes" or "no" or "desktop" or "mobile"
"autostart-embedded"            : "no", // "yes" or "no" or "desktop" or "mobile" (It takes priority over "autostart" when the book is embedded in a webpage)
"start-embedded-in-new-window"  : "mobile", // "yes" or "no" or "desktop" or "mobile" (It is used only when "autostart" (or "autostart-embedded") is NOT enabled)


//==============================================================================================================================================
//-- UI / Design
//----------------------------------------------------------------------------------------------------------------------------------------------

"use-menubar"                : "yes", // "yes" or "no" or "desktop" or "mobile"
"use-full-height"            : "yes", // "yes" or "no" or "desktop" or "mobile". If "use-menubar" is interpreted as "no", "use-full-height" is always treated as "yes".

"use-arrows"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"flipper-width"              : 0.25, // Number of ratio (less than 1) or pixel (1 or greater)

"use-keys"                   : "yes", // "yes" or "no" or "desktop" or "mobile"

"use-slider"                 : "yes", // "yes" or "no" or "desktop" or "mobile"
"flip-pages-during-sliding"  : "yes", // "yes" or "no" or "desktop" or "mobile"

"use-nombre"                 : "yes", // "yes" or "no" or "desktop" or "mobile"

"use-font-size-changer"      : "yes", // "yes" or "no" or "desktop" or "mobile"
"base-font-size"             : "auto", // Number of pixel or "auto"
"font-size-scale-per-step"   : 1.25, // Number of scale

"use-loupe"                  : "desktop", // "yes" or "no" or "desktop" or "mobile" (Note: Loupe buttons will not appear in touch-devices even if it is set "yes" or "mobile".)
"loupe-max-scale"            : 4, // Number of scale (greater than 1)
"loupe-scale-per-step"       : 1.6, // Number of scale (greater than 1, less than or equal to "loupe-max-scale")
"zoom-out-for-utilities"     : "yes", // "yes" or "no" or "desktop" or "mobile"

"use-history"                : "yes", // "yes" or "no" or "desktop" or "mobile"
"max-history"                : 19, // Number (0-19). If larger than 19, treated as 19. If 0, "use-history" is treated as "no". 

"use-bookmarks"              : "yes", // "yes" or "no" or "desktop" or "mobile"
"max-bookmarks"              : 3, // Number (0-9). If larger than 9, treated as 9. If 0, "use-bookmarks" is treated as "no" (but old data is kept in localStorage). 

"orientation-border-ratio"   : 1 * 2 / 1.5, // Number (Width per Height)

"ui-font-family"             : "", // CSS font-family value as "'Helvetica', sans-serif" or ""

"item-padding-left"          : 24, // Number of pixel (It affects only for reflowable books.)
"item-padding-right"         : 24, // Number of pixel (It affects only for reflowable books.)
"item-padding-top"           : 48, // Number of pixel (It affects only for reflowable books.)
"item-padding-bottom"        : 24, // Number of pixel (It affects only for reflowable books.)

"spread-gap"                 : 48, // Number of pixel (It affects only in paged view mode.)
"spread-margin"              : 0, // Number of pixel

"fix-nav-ttb"                : "no", // "yes" or "no" or "desktop" or "mobile"

"on-doubletap"               : "",
"on-tripletap"               : "",

"content-draggable"          : [true, true], // [<TF>, <TF>]
"orthogonal-arrow-keys"      : ["move", "switch"], // [<S1>, <S2>]
"orthogonal-edges"           : ["utilities", "utilities"], // [<S1>, <S2>]
"orthogonal-touch-moves"     : ["move", "switch"], // [<S1>, <S2>]
"orthogonal-wheelings"       : ["move", "across"], // [<S1>, <S3>]
//                             ^ Each item of the arrays corresponds to the view mode:
//                                 * the first is for the "paged" view mode, and
//                                 * the second is for the "horizontal"/"vertical" scroll view modes.
//                             ^ Types of the values:
//                                 * <TF>: true or false
//                                 * <S1>: "" (ignore) or "utilities" or "move"
//                                 * <S2>: "" (ignore) or "utilities" or "move" or "switch"
//                                 * <S3>: "" (ignore) or "utilities" or "move" or "switch" or "across"


//==============================================================================================================================================
//-- Extensions
//----------------------------------------------------------------------------------------------------------------------------------------------

// "src" is relative path from this preset file to the JavaScript file of the extension.
// "id" must be defined in each extension file.
"extensions": [
    // { "src": "../extensions/FOLDER-NAME-IF-EXISTS/FILE-NAME.js" }, // <THIS LINE IS AN EXAMPLE>
""],


//==============================================================================================================================================
//-- Extra
//----------------------------------------------------------------------------------------------------------------------------------------------

"website-name-in-title"    : "", // "" or name of your website replaces string "Bibi" in <title>.
"website-name-in-menu"     : "", // "" or name of your website appears in setting-menu as a link. (Requires "website-href")
"website-href"             : "", // "" or URL of your website to be used for the link in setting-menu. (Requires "website-name-in-menu")
"remove-bibi-website-link" : false, // true or false (if true, the link to Bibi Website is not to be added in setting-menu)


//==============================================================================================================================================
//-- System
//----------------------------------------------------------------------------------------------------------------------------------------------

"extract-if-necessary"               : [".epub", ".zip"], // File extensions of the book specified in URL, which you want Bibi to try to extract first. (More info is <02> at the bottom of this preset file.)

"default-page-progression-direction" : "ltr", // "ltr" or "rtl". Most of EPUBs have right property in itself, but....

"accept-local-file"                  : "yes", // "yes" or "no" or "desktop" or "mobile". (If it is enabled, Bibi prepares UI for loading files. Conditions for acceptance are <03> at the bottom of this preset file.)
"accept-bibizine"                    : true, // true or false (If true, Bibi accepts EPUB-like bibiZine formated book. If you are interested in it, please contact the author)
"accept-blob-converted-data"         : true, // true or false (If true, Bibi accepts BLOB object converted from a EPUB File. If you are interested in it, please contact the author)
"accept-base64-encoded-data"         : true, // true or false (If true, Bibi accepts Base64 string encoded from a EPUB File. If you are interested in it, please contact the author)

"pagination-method"                  : "auto", // "auto" or "x". (It affects only for vertical-text reflowable books. More info is <04> at the bottom of this preset file.)
"allow-placeholders"                 : true, // true or false. (true is highly recommended.)
"prioritise-fallbacks"               : false, // true or false (If true, Bibi uses <item> at the end of the fallback-chain.)


//==============================================================================================================================================
//-- DANGER ZONE
//----------------------------------------------------------------------------------------------------------------------------------------------
// If you publish Bibi online,
// * keep these options as default, or/and
// * keep your Bibi and website not to open files which you can not guarantee its security.
//----------------------------------------------------------------------------------------------------------------------------------------------

/* !!!! BE CAREFUL !!!! */ "allow-scripts-in-content" : false, // true or false (false is recommended).
// If you change its value `true`, Bibi does not remove scripts natively-included in EPUB.
// It makes Bibi to be able to open EPUBs including useful scripts.
// But on the other hand, it may also allow XSS of malicious EPUB in some cases.

/* !!!! BE CAREFUL !!!! */ "trustworthy-origins" : [], // origins you trust other than where this Bibi is installed. (blank is recommended).
// If you add origins to it, Bibi is made to open not only EPUBs in the same origin as Bibi itself is installed but also EPUBs in remote origins.
// It is useful for some cases like that you want to set directory on the other storaging server as "bookshelf".
// But note that not to set an origin where someone else also can publish files.
// If you do so, someone else can publish one's EPUB as it is on your website, and it may also allow XSS of malicious EPUB in some cases.


/*


//==============================================================================================================================================


## <01> You can use a path begins with "http(s)://" for "bookshelf" option in cases of the below:

    * The origin of the path defined in the "bookshelf" option is same as the origin of this Bibi.
    * [OR] The origin is included in "trustworthy-origins" option.
        - [AND] The origin allows COR from the origin of this Bibi.


## <02> Bibi tries to extract at first in cases of the below:

    * The "extract-if-necessary" option includes "*".
    * [OR] The "extract-if-necessary" option includes one or more file extensions.
        - [AND] The book name specified as a value of the `book` (or `zine`) query in URL has a file extension.
        - [AND] The file extension of the book name is included in the "extract-if-necessary" option.
    * [OR] The "extract-if-necessary" option is "".
        - [AND] The book name specified as a value of the `book` (or `zine`) query in URL has no file extension.

    ### Note:
    * If Bibi failed to extract it, automatically tries to load as a folder (directory).
    * The "extract-if-necessary" option affects also as conditions for acceptance of local file. Read <03> at the next.


## <03> Bibi accepts user's local file in cases of the below:

    * The file is an EPUB.
        - [AND] The extension of the file is ".epub".
        - [AND] The "extract-if-necessary" option includes ".epub" or "*".
        - [AND] The MIME-Type sent from the browser is "application/epub+zip".
    * [OR] The file is a bibiZine.
        - [AND] The extension of the file is ".zip".
        - [AND] The "extract-if-necessary" includes ".zip" or "*".
        - [AND] The MIME-Type sent from the browser is "application/zip", "application/x-zip", or "application/x-zip-compressed".

    ### Note:
    * Extension of the file is required even if "extract-if-necessary" is "" (or includes "*").


## <04> Setting "x" for "pagination-method" option

    It affects only for reflowable vertical-text books.
    If "x" is set for "pagination-method", Bibi tries to use an experimental layout method on modern web-browsers.
    It realizes more prettier layout for simple books like novels.
    But sometime causes bad result for some books with figures or floating objects.


//==============================================================================================================================================


*/


"bibi": "EPUB Reader on your website." });
