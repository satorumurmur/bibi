import DOMPurify from 'dompurify/dist/purify.min.js';

Bibi.x({

    id: 'Sanitizer',
    description: 'Content Sanitizer.',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.9.0'

})(function() {

    O.sanitizeItemSource = (Source, Opt) => {
        if(Source && typeof Source.Content == 'string' && Opt && typeof Opt.As == 'string') {
            const Settings = O.sanitizeItemSource.Settings[Opt.As];
            if(Settings) {
                //console.log(Opt.As, Source.Content);
                (pp => pp ? pp(Source) : true)(Settings.preprocess);
                Source.Content = DOMPurify.sanitize(Source.Content, Settings.Options);
                (pp => pp ? pp(Source) : true)(Settings.postprocess);
                //console.log(Opt.As, Source.Content);
                return Source.Content;
            }
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

        const Settings = O.sanitizeItemSource.Settings = {};
        Settings['XHTML'] = {
            Options: {
                PARSER_MEDIA_TYPE: 'application/xhtml+xml',
                   WHOLE_DOCUMENT: false,
                     USE_PROFILES: { html: true, svg: true, svgFilters: true, mathMl: true }, 
                         ADD_TAGS: ['link', 'meta'].concat(MathMLElementTagNames),
                         ADD_ATTR: ['xmlns', 'xmlns:epub', 'epub:type', 'charset', 'http-equiv', 'content']
            },
            postprocess: (Source) => Source.Content = Source.Content.replace(/(<head[\s>])/, '\n$1').replace(/(<\/body>)/, '$1\n')
        };
        Settings['HTML'] = {
            Options: Object.assign({}, Settings['XHTML'].Options, {
                PARSER_MEDIA_TYPE: 'text/html',
                   WHOLE_DOCUMENT: true
            }),
            postprocess: Settings['XHTML'].postprocess
        };
        Settings['SVG'] = {};

});
