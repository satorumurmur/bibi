P = BiB.i.Preset = {

	name                                : "BiB/i Default",              // "Name of this preset. As you like."
	description                         : "Default Preset.",            // "Description of this preset. As you like."

	"book-display-mode"                 : "all",                        // "all" or "spread" or "item"
	"page-progression-direction"        : "ltr",                        // "ltr" or "rtl" ("ltr" is recommended.)
	"spread-layout-direction"           : "auto",                       // "auto" or "vertical" or "horizontal" (or "ttb" or "ltr" or "rtl")
	"page-orientation"                  : "auto",                       // "portrait" or "landscape" or "window" or "auto" !!!! changed from "spread-orientation" !!!!

	"book-background"                   : "rgb(64,64,64)",              // CSS value or ""

	"spread-separation"                 : 8,                            // px (if you set odd-number, it will be added 1.)
	"spread-margin-start"               : 4,                            // px
	"spread-margin-end"                 : 4,                            // px

	"spread-separation_narrow-device"   : 8,                            // px (if you set odd-number, it will be added 1.)
	"spread-margin-start_narrow-device" : 4,                            // px
	"spread-margin-end_narrow-device"   : 4,                            // px

	"spread-border-radius"              : "2px",                        // CSS value or ""
	"spread-box-shadow"                 : "0 1px 4px rgba(0,0,0,0.75)", // CSS value or ""

	"item-padding-left"                 : 20,                           // px
	"item-padding-right"                : 20,                           // px
	"item-padding-top"                  : 30,                           // px
	"item-padding-bottom"               : 30,                           // px

	"item-padding-left_narrow-device"   : 10,                           // px
	"item-padding-right_narrow-device"  : 10,                           // px
	"item-padding-top_narrow-device"    : 15,                           // px
	"item-padding-bottom_narrow-device" : 15,                           // px

	"item-column-rule"                  : "",                           // CSS value or ""

	"img-max-width"                     : "100%",                       // CSS value or "" (if you set CSS value, it will be used when img-elements have no max-width CSS property)
	"img-max-height"                    : "100%",                       // CSS value or "" (if you set CSS value, it will be used when img-elements have no max-height CSS property)

	"center-end-spreads"                : true,                         // true or false (no quotes required)

loaded: true } // do not edit.