import DOMPurify from 'dompurify/dist/purify.min.js';

Bibi.x({

    id: 'Sanitizer',
    description: 'Content Sanitizer.',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.0.0'

})(function() {

    O.sanitizeItemContent = (Item, Opt) => {
        if(Item && typeof Item.Content == 'string' && Opt && typeof Opt.As == 'string') {
            const Settings = O.sanitizeItemContent.Settings[Opt.As];
            if(Settings) {
                (pp => pp ? pp(Item) : true)(Settings.preprocess);
                Item.Content = DOMPurify.sanitize(Item.Content, Settings.Options);
                (pp => pp ? pp(Item) : true)(Settings.postprocess);
                return Item.Content;
            }
        }
        const ErrorMessage = `Sanitizer: Invalid Arguments.`;
        I.note(ErrorMessage, 99999999999, 'ERROR');
        O.error(ErrorMessage);
        throw new Error(ErrorMessage);
    };

        O.sanitizeItemContent.Settings = {
            'HTML': {
                Options: { WHOLE_DOCUMENT: true, ADD_TAGS: ['link'] },
                preprocess: (Item) => {
                    const ContentHTMLAttributes = (Matched => Matched ? Matched[1] : '')(Item.Content.match(/<html(\s[^>]+)>/));
                    if(!ContentHTMLAttributes) return;
                    Item.HasContentHTMLAttributes = true;
                    Item.Content += `<div${ ContentHTMLAttributes }>bibi:html-attributes</div>`;
                },
                postprocess: (Item) => {
                    if(!Item.HasContentHTMLAttributes) return;
                    delete Item.HasContentHTMLAttributes;
                    const HolderRE = /<div(\s[^>]+)>bibi:html-attributes<\/div>/;
                    const ContentHTMLAttributes = (Matched => Matched ? Matched[1] : '')(Item.Content.match(HolderRE));
                    if(ContentHTMLAttributes) Item.Content = Item.Content.replace(HolderRE, '').replace('<html>', '<html' + ContentHTMLAttributes + '>');
                }
            },
            'SVG' : {}
        };

});
