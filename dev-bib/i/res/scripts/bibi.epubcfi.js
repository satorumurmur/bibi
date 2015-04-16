



/*!
 *
 * # BiB/i EPUBCFI Utilities
 *
 * - "EPUBCFI Utilities (for BiB/i, or Others)"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Wed February 4 23:15:00 2015 +0900
 */ BibiEPUBCFI = { Version: "0.32.2", Build: 20150204.1,

/* -----------------------------------------------------------------------------------------------------------------

    - An Example is Bottom of This Document.

----------------------------------------------------------------------------------------------------------------- */

	CFIString: "", Current: 0, // Log: true, LogCorrection: true, LogCancelation: true,

	parse: function(CFIString, Scope) {
		if(!CFIString || typeof CFIString != "string") return null;
		try { CFIString = decodeURIComponent(CFIString); } catch(e) { this.log(0, "Unregulated URIEncoding."); return null; }
		if(!Scope || typeof Scope != "string" || typeof this["parse" + Scope] != "function") Scope = "Fragment";
		if(Scope == "Fragment") CFIString = CFIString.replace(/^(epubcfi\()?/, "epubcfi(").replace(/(\))?$/, ")");
		this.CFIString = CFIString, this.Current = 0;
		if(this.Log && this.LogCancelation) {
			this.log(1, "BiB/i EPUB-CFI");
			this.log(2, "parse");
			this.log(3, "CFIString: " + this.CFIString);
		}
		return this["parse" + Scope]();
	},

	parseFragment: function() {
		var Foothold = this.Current, CFI = {};
		if(!this.parseString("epubcfi(")) return this.cancel(Foothold, "Fragment");
		CFI = this.parseCFI(); if(CFI === null) return this.cancel(Foothold);
		if(!this.parseString(")")) return this.cancel(Foothold, "Fragment");
		return CFI;
	},
	parseCFI: function() {
		var Foothold = this.Current, CFI = { Type: "CFI", Path: {} };
		CFI.Path = this.parsePath(); if(!CFI.Path) return this.cancel(Foothold, "CFI");
		if(this.parseString(",")) {
			CFI.Start = this.parseLocalPath(); if(!CFI.Start.Steps.length && !CFI.Start.TermStep) return this.cancel(Foothold, "CFI > Range");
			if(!this.parseString(",")) return this.cancel(Foothold, "CFI > Range");
			CFI.End   = this.parseLocalPath(); if(  !CFI.End.Steps.length &&   !CFI.End.TermStep) return this.cancel(Foothold, "CFI > Range");
		}
		return CFI;
	},
	parsePath: function() {
		var Foothold = this.Current, Path = { Type: "Path", Steps: [] }, LocalPath = {};
		Path.Steps[0] = this.parseStep(); if(!Path.Steps[0]) return this.cancel(Foothold, "Path");
		LocalPath = this.parseLocalPath();
		if(LocalPath) Path.Steps = Path.Steps.concat(LocalPath.Steps); else return this.cancel(Foothold, "Path");
		return Path;
	},
	parseLocalPath: function() {
		var Foothold = this.Current, LocalPath = { Type: "LocalPath", Steps: [] }, StepRoot = LocalPath, Step = null, TermStep = null;
		Step = this.parseStep("Local");
		while(Step !== null) {
			StepRoot.Steps.push(Step);
			Step = this.parseStep("Local");
			if(!Step) break;
			if(Step.Type == "IndirectStep") {
				var IndirectPath = { Type: "IndirectPath", Steps: [] };
				StepRoot.Steps.push(IndirectPath);
				StepRoot = IndirectPath;
			} else if(Step.Type == "TermStep") {
				TermStep = Step;
				break;
			}
		}
		if(TermStep) StepRoot.Steps.push(TermStep);
		return (LocalPath.Steps.length ? LocalPath : null);
	},
	parseStep: function(Local) {
		var Foothold = this.Current, Step = {};
		     if(         this.parseString( "/")) Step.Type =         "Step";
		else if(Local && this.parseString("!/")) Step.Type = "IndirectStep";
		else if(Local && this.parseString( ":")) Step.Type =     "TermStep"; else return this.cancel(Foothold, "Step");
		Step.Index = this.parseString(/^(0|[1-9][0-9]*)/); if(Step.Index === null) return this.cancel(Foothold, "Step");
		Step.Index = parseInt(Step.Index);
		if(this.parseString("[")) {
			if(Step.Type != "TermStep") {
				Step.ID = this.parseString(/^[a-zA-Z_:][a-zA-Z0-9_:\-\.]+/);
				if(!Step.ID) return this.cancel(Foothold, "Step > Assertion > ID");
			} else {
				var CSV = [], Side = null, ValueRegExp = /^((\^[\^\[\]\(\)\,\;\=])|[_a-zA-Z0-9%\- ])*/;
				CSV.push(this.parseString(ValueRegExp)); if(this.parseString(",")) CSV.push(this.parseString(ValueRegExp));
				if(CSV[0]) Step.Preceding = CSV[0];
				if(CSV[1]) Step.Following = CSV[1];
				if(this.parseString(/^;s=/)) Side = this.parseString(/^[ab]/);
				if(Side)   Step.Side = Side;
				if(!Step.Preceding && !Step.Following && !Step.Side) return this.cancel(Foothold, "Step > Assertion > TextLocation");
			}
			if(!this.parseString("]")) return this.cancel(Foothold, "Step > Assertion");
		}
		return Step;
	},
	parseString: function(S) {
		var Correction = null;
		if(S instanceof RegExp) {
			var CFIString = this.CFIString.substr(this.Current, this.CFIString.length - this.Current);
			if(S.test(CFIString)) {
				S = CFIString.match(S)[0];
				this.Current += S.length;
				Correction = S;
			}
		} else if(this.CFIString.substr(this.Current, S.length) === S) {
			this.Current += S.length;
			Correction = S;
		}
		return this.correct(Correction);
	},

	correct: function(Correction) {
		if(this.Log && this.LogCorrection && Correction) this.log(3, Correction);
		return Correction;
	},
	cancel: function(Foothold, Parser) {
		if(this.Log && this.LogCancelation) this.log(4, "cancel: parse" + Parser + " (" + Foothold + "-" + this.Current + "/" + this.CFIString.length + ")");
		if(typeof Foothold == "number") this.Current = Foothold;
		return null;
	},
	log: function(Lv, Message) {
		if(!this.Log || !console || !console.log) return;
		     if(Lv == 0) Message = "[ERROR] " + Message;
		else if(Lv == 1) Message = "---------------- " + Message + " ----------------";
		else if(Lv == 2) Message = Message;
		else if(Lv == 3) Message = " - " + Message;
		else if(Lv == 4) Message = "   . " + Message;
		console.log('BiB/i EPUB-CFI: ' + Message);
	}

}

/* -----------------------------------------------------------------------------------------------------------------

   EXAMPLE:

   - BibiEPUBCFI.parse("epubcfi(/6/4!/4/10!/4/2:32[All%20You%20Need%20Is,Love;s=a])"); // returns following object.

--------------------------------------------------------------------------------------------------------------------

{
	Type: "CFI",
	Path: {
		Type: "Path",
		Steps: [
			{
				Type: "Step",
				Index: "6"
			},
			{
				Type: "Step",
				Index: "4"
			},
			{
				Type: "IndirectPath",
				Steps: [
					{
						Type: "IndirectStep",
						Index: "4"
					},
					{
						Type: "Step",
						Index: "10"
					},
					{
						Type: "IndirectPath",
						Steps: [
							{
								Type: "IndirectStep",
								Index: "4"
							},
							{
								Type: "Step",
								Index: "2"
							}
						],
						TermStep: {
							Type: "TermStep",
							Index: "32",
							Preceding: "All You Need Is",
							Following: "Love",
							Side: "a"
						}
					}
				]
			}
		]
	}
}

----------------------------------------------------------------------------------------------------------------- */



