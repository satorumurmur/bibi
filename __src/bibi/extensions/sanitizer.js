import DOMPurify from 'dompurify/dist/purify.min.js';

Bibi.x({

    id: 'Sanitizer',
    description: 'Content Sanitizer.',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.9.1'

})(() => { 'use strict';

    O.sanitizeItemSourceText = (SourceText, Opt) => {
        if(SourceText && typeof SourceText == 'string' && Opt && typeof Opt.As == 'string') {
            const Settings = O.sanitizeItemSourceText.Settings[Opt.As] || {};
            SourceText = Settings.preprocess?.(SourceText) || SourceText;
            SourceText = DOMPurify.sanitize(SourceText, Settings.Options);
            SourceText = Settings.postprocess?.(SourceText) || SourceText;
            return SourceText;
        }
        const ErrorMessage = `Sanitizer: Invalid Arguments.`;
        I.notify(ErrorMessage, { Type: 'Error', Time: 99999999999 });
        O.error(ErrorMessage);
        throw new Error(ErrorMessage);
    };

        const MathMLElementTagNames = ['math', // https://developer.mozilla.org/docs/Web/MathML/Element
        /* A: */ 'maction', 'maligngroup', 'malignmark',
        /* E: */ 'menclose', 'merror',
        /* F: */ 'mfenced', 'mfrac',
        /* G: */ 'mglyph',
        /* I: */ 'mi',
        /* L: */ 'mlabeledtr', 'mlongdiv',
        /* M: */ 'mmultiscripts',
        /* N: */ 'mn',
        /* O: */ 'mo', 'mover',
        /* P: */ 'mpadded', 'mphantom',
        /* R: */ 'mroot', 'mrow',
        /* S: */ 'ms', 'mscarries', 'mscarry', 'msgroup', 'msline', 'mspace', 'msqrt', 'msrow', 'mstack', 'mstyle', 'msub', 'msup', 'msubsup',
        /* T: */ 'mtable', 'mtd', 'mtext', 'mtr',
        /* U: */ 'munder', 'munderover',
        /* #: */ 'semantics', 'annotation', 'annotation-xml',
        /* *: */ 'none' // https://developer.mozilla.org/docs/Web/MathML/Element/mmultiscripts
        ];

        O.sanitizeItemSourceText.Settings = {
            XHTML: {
                Options: {
                    PARSER_MEDIA_TYPE: 'application/xhtml+xml',
                    WHOLE_DOCUMENT: false,
                        USE_PROFILES: { html: true, svg: true, svgFilters: true, mathMl: true },
                            ADD_TAGS: ['link', 'meta'].concat(MathMLElementTagNames),
                            ADD_ATTR: ['xmlns', 'xmlns:epub', 'xml:lang', 'epub:type', 'charset', 'http-equiv', 'content', 'viewBox']
                }
            }
        };

});
