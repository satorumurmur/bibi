Bibi.preset({


//==============================================================================================================================================
//-- Bookshelf
//----------------------------------------------------------------------------------------------------------------------------------------------

"bookshelf" : "../../bibi-bookshelf", // Relative path from this preset file to the bookshelf directory. "/" at the end is ignored.
// To use a path begins with "http(s)://", read <01> at the bottom.


//==============================================================================================================================================
//-- Behavior
//----------------------------------------------------------------------------------------------------------------------------------------------

"available-reader-view-modes"   : ["paged", "horizontal", "vertical"],
// Set one or two or all of the three: "paged", "horizontal", and "vertical".
// "paged" is for page flipping, "horizontal" and "vertical" are for scrolling in each direction.
// If none of the three is set, treated as setting all of them.

"default-reader-view-mode"      : "auto", // "auto" | "paged" | "horizontal" | "vertical" // If the value is not "auto" and it isn't included in "available-reader-view-modes", treated as "auto".
"full-breadth-layout-in-scroll" : "no", // "yes" | "no" | "desktop" | "mobile"
"fix-reader-view-mode"          : "no", // "yes" | "no" | "desktop" | "mobile" // If "available-reader-view-modes" has only one view mode, "fix-reader-view-mode" is treated as "yes".

"keep-settings"                 : "yes", // "yes" | "no" | "desktop" | "mobile"
"resume-from-last-position"     : "yes", // "yes" | "no" | "desktop" | "mobile"

"autostart"                     : "yes", // "yes" | "no" | "desktop" | "mobile"
"autostart-embedded"            : "no", // "yes" | "no" | "desktop" | "mobile" // It takes priority over "autostart" when the book is embedded in a webpage.
"start-embedded-in-new-window"  : "mobile", // "yes" | "no" | "desktop" | "mobile" // It affects only when "autostart" (or "autostart-embedded") is interpreted as "no".


//==============================================================================================================================================
//-- UI / Design
//----------------------------------------------------------------------------------------------------------------------------------------------

"use-menubar"                : "yes", // "yes" | "no" | "desktop" | "mobile"
"use-full-height"            : "yes", // "yes" | "no" | "desktop" | "mobile" // If "use-menubar" is interpreted as "no", "use-full-height" is always treated as "yes".

"use-arrows"                 : "yes", // "yes" | "no" | "desktop" | "mobile"
"flipper-width"              : 0.25, // Number of ratio to the viewport (less than 1) | pixels (1 or greater) // Less than 0 is treated as 0.

"use-keys"                   : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-slider"                 : "yes", // "yes" | "no" | "desktop" | "mobile"
"flip-pages-during-sliding"  : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-nombre"                 : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-textsetter-ui"          : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-fontsize-setter"        : "yes", // "yes" | "no" | "desktop" | "mobile"
"fontsize-scale-per-step"    : 1.25, // Number of scale
"base-fontsize"              : "auto", // "auto" | Number of pixels

"use-linespacing-setter"     : "yes", // "yes" | "no" | "desktop" | "mobile"
"linespacing-scale-per-step" : 1.25, // Number of scale

"use-flowdirection-setter"   : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-popup-footnotes"        : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-search-ui"              : "yes", // "yes" | "no" | "desktop" | "mobile"

"use-loupe-ui"               : "yes", // "yes" | "no" | "desktop" | "mobile" // Loupe UI buttons are always hidden and disabled on reflowable books or in touch-devices.
"loupe-max-scale"            : 4, // Number of scale (greater than 1)
"loupe-scale-per-step"       : 1.6, // Number of scale (greater than 1, less than or equal to "loupe-max-scale")
"zoom-out-for-utilities"     : "yes", // "yes" | "no" | "desktop" | "mobile" // If "use-slider" is interpreted as "no", "zoom-out-for-utilities" is always treated as "no".

"use-bookmark-ui"            : "yes", // "yes" | "no" | "desktop" | "mobile"
"max-bookmarks"              : 3, // Number (0-9) // If larger than 9, treated as 9. If 0, "use-bookmark-ui" and "use-bookmarks" are treated as "no" (but old data is kept in localStorage). 

"use-history-ui"             : "yes", // "yes" | "no" | "desktop" | "mobile". // History UI button requires the Slider UI. If "use-slider" is interpreted as "no", "use-history-ui" is always treated as "no".
"max-histories"              : 19, // Number (0-19) // If larger than 19, treated as 19. If 0, "use-history-ui" and "use-histories" are treated as "no".

"orientation-border-ratio"   : 1 * 2 / 1.5, // Number (Width per Height)

"ui-font-family"             : "", // CSS font-family value as "'Helvetica', sans-serif"

"item-padding-left"          : 24, // Number of pixels // It affects only for reflowable books.
"item-padding-right"         : 24, // Number of pixels // It affects only for reflowable books.
"item-padding-top"           : 48, // Number of pixels // It affects only for reflowable books.
"item-padding-bottom"        : 24, // Number of pixels // It affects only for reflowable books.

"concatenate-spreads"        : ["auto", "auto"], // ["auto" | "never" | "always", "auto" | "never" | "always"] // It affects only for fixed-layout books in the "horizontal"/"vertical" scroll view modes.
//                             ^ Each item of the arrays corresponds to the view mode:
//                                 * the first is for the "horizontal" scroll view mode.
//                                 * the second is for the "vertical" scroll view mode.

"content-margin"             : 0, // Number of pixels

"background-spreading"       : true, // true | false

"fix-nav-ttb"                : "no", // "yes" | "no" | "desktop" | "mobile"


//==============================================================================================================================================
//-- Input
//----------------------------------------------------------------------------------------------------------------------------------------------

"on-doubletap"             : "",
"on-tripletap"             : "",

"on-singletap-with-altkey" : "",
"on-doubletap-with-altkey" : "",
"on-tripletap-with-altkey" : "",

"content-draggable"        : [true, true], // [<TF>, <TF>]
"on-orthogonal-arrowkey"   : ["move", "switch"], // [<S1>, <S1>]
"on-orthogonal-edgetap"    : ["utilities", "utilities"], // [<S1>, <S1>]
"on-orthogonal-touchmove"  : ["move", "switch"], // [<S1>, <S1>]
"on-orthogonal-wheel"      : ["move", "across"], // [<S2>, <S2>]
//                           ^ Each item of the arrays corresponds to the view mode:
//                               * the 1st value is for the "paged" view mode, and
//                               * the 2nd value is for the "horizontal" and "vertical" scroll view modes.
//                           ^ Sets of the values:
//                               * <TF>: true | false
//                               * <S1>: "" (ignore) | "utilities" | "move" | "switch"
//                               * <S2>: "" (ignore) | "utilities" | "move" | "switch" | "across"
//                           ^ Values:
//                               * "utilities":
//                                   - Toggling utilities (the menu bar at the top and the slider at the bottom).
//                               * "move":
//                                   - Turning or scrolling page-by-page.
//                               * "switch":
//                                   - Switching between two view modes.
//                                   - If "available-reader-view-modes" has all three view modes:
//                                       - It is effective only in the 2nd value and treated as switching between "horizontal" and "vertical" scroll view modes.
//                                       - Even if setting it in the 1st value for "paged" view mode, it is treated as "" (ignoring).
//                                   - If "available-reader-view-modes" has only one view mode:
//                                       - It is always treated as "" (ignoring).
//                               * "across":
//                                   - Scrolling in the orthogonal direction of wheeling (= natural scrolling direction of the book content).
//                                   - Setting "across" for the "paged" view mode (= the 1st value) is treated as "move".

"touchmove-ignoring-area": [0, 0, 0, 0], // Four numbers of ratio to the viewport (less than 1) | pixels (1 or greater) // Less than 0 is treated as 0.
// Each item of the array corresponds to the distance from the edge of the top, right, bottom, and left.
// Flick or swipe started from within the range is ignored.

// Each item of the array corresponds to the top, right, bottom, and left. Every item is: Number of ratio (less than 1) | Number of pixels (1 or greater)

"indicate-orthogonal-arrows-if-necessary" : false, // true | false

"recognize-repeated-taps-separately": true, // true | false
// If true:
//     * Bibi recognizes all the repeated tap/clicks as separate single-tap/clicks.
//     * It accelerates some UI response, but Bibi no longer recognizes double/triple-tap/click.
// If you want to customize "on-doubletap(-with-altkey)" or "on-tripletap(-with-altkey)", you have to set "recognize-repeated-taps-separately" to false.

"prioritise-viewer-operation-over-text-selection" : false, // true | false
// If true:
//     * When dragging with the mouse or trackpad, priority is given to browsing operations (ex. page-turning, axis-switching) instead of text selection.


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

"website-name-in-title"    : "", // Name of your website which replaces string "Bibi" in <title>
"website-name-in-menu"     : "", // Name of your website appears in setting-menu as a link // It requires "website-href".
"website-href"             : "", // URL of your website to be used for the link in setting-menu // It requires "website-name-in-menu".
"remove-bibi-website-link" : false, // true | false // If true, the link to Bibi Website is not to be added in setting-menu.


//==============================================================================================================================================
//-- System
//----------------------------------------------------------------------------------------------------------------------------------------------

"extract-if-necessary"               : [".epub", ".zip"], // File extensions of the book specified in URL, which you want Bibi to try to extract first. // More info is <02> at the bottom.

"default-page-progression-direction" : "ltr", // "ltr" | "rtl" // Most of EPUBs have right property in itself, but....

"accept-local-file"                  : "yes", // "yes" | "no" | "desktop" | "mobile" // If it is enabled, Bibi prepares UI for loading files. Conditions for acceptance are <03> at the bottom.
"accept-bibizine"                    : true, // true | false // If true, Bibi accepts EPUB-like BibiZine formated book. (If you are interested in it, please contact the author.)
"accept-blob-converted-data"         : true, // true | false // If true, Bibi accepts BLOB object converted from a EPUB File. (If you are interested in it, please contact the author.)
"accept-base64-encoded-data"         : true, // true | false // If true, Bibi accepts Base64 string encoded from a EPUB File. (If you are interested in it, please contact the author.)

"pagination-method"                  : "auto", // "auto" | "x" // It affects only for vertical-text reflowable books. More info is <04> at the bottom.
"allow-placeholders"                 : true, // true | false // true is highly recommended.
"prioritise-fallbacks"               : false, // true | false // If true, Bibi uses <item> at the end of the fallback-chain.

"uiless"                             : false, // true | false
"use-textsetter"                     : true, // true | false
"use-bookmarks"                      : true, // true | false
"use-histories"                      : true, // true | false
"manualize-adding-histories"         : false, // true | false

"inhibit"                            : [], // You may add "selecting", "saving-images", "contextual-menu", and/or "printing" (or "*" instead of each).


//==============================================================================================================================================
//-- DANGER ZONE
//----------------------------------------------------------------------------------------------------------------------------------------------
// If you publish Bibi online,
// * keep these options as default, or/and
// * keep your Bibi and website not to open files which you can not guarantee its security.
//----------------------------------------------------------------------------------------------------------------------------------------------

/* !!!! BE CAREFUL !!!! */ "allow-scripts-in-content" : false, // true | false // <!> false is highly recommended.
// If you change its value `true`, Bibi does not remove scripts natively-included in EPUB.
// It makes Bibi to be able to open EPUBs including useful scripts.
// But on the other hand, it may also allow XSS of malicious EPUB in some cases.

/* !!!! BE CAREFUL !!!! */ "trustworthy-origins" : [], // Origins you trust other than where this Bibi is installed. <!> blank is highly recommended.
// If you add origins to it, Bibi is made to open not only EPUBs in the same origin as Bibi itself is installed but also EPUBs in remote origins.
// It is useful for some cases like that you want to set directory on the other storaging server as "bookshelf".
// But note that not to set an origin where someone else also can publish files.
// If you do so, someone else can publish one's EPUB as it is on your website, and it may also allow XSS of malicious EPUB in some cases.

/* !!!! BE CAREFUL !!!! */ "allow-external-item-href" : false, // true | false // <!> false is highly recommended.

/* !!!! BE CAREFUL !!!! */ "request-with-credentials" : false,


/*


//==============================================================================================================================================
//-- Footnotes
//----------------------------------------------------------------------------------------------------------------------------------------------


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
    * [OR] The file is a BibiZine.
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
