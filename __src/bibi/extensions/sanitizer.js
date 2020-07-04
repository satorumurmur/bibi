import DOMPurify from 'dompurify/dist/purify.min.js';

Bibi.x({

    id: 'Sanitizer',
    description: 'Content Sanitizer.',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.2.0'

})(function() {

    O.sanitizeItemSource = (Source, Opt) => {
        if(Source && typeof Source.Content == 'string' && Opt && typeof Opt.As == 'string') {
            const Settings = O.sanitizeItemSource.Settings[Opt.As];
            if(Settings) {
                (pp => pp ? pp(Source) : true)(Settings.preprocess);
                Source.Content = DOMPurify.sanitize(Source.Content, Settings.Options);
                (pp => pp ? pp(Source) : true)(Settings.postprocess);
                //console.log(Source.Content);
                return Source.Content;
            }
        }
        const ErrorMessage = `Sanitizer: Invalid Arguments.`;
        I.note(ErrorMessage, 99999999999, 'ERROR');
        O.error(ErrorMessage);
        throw new Error(ErrorMessage);
    };

        O.sanitizeItemSource.Settings = {
            'HTML': {
                Options: { WHOLE_DOCUMENT: true, ADD_TAGS: ['link', 'meta'], ADD_ATTR: ['xmlns', 'xmlns:epub', 'charset', 'http-equiv', 'content'] },
                postprocess: (Source) => Source.Content = Source.Content.replace(/(<head[\s>])/, '\n$1').replace(/(<\/body>)/, '$1\n')
            },
            'SVG' : {}
        };

});
