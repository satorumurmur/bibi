Bibi.x({

    id: 'Share',
    description: 'Share the webpage which is holding BiB/i or embedded books through SNS.',
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '2.0.1'

})(function() {

    'use strict';

    I.Sharer = {};

    // Share SubPanel
    const ShareSubPanel = I.createSubPanel({
        Opener: I.createButtonGroup({ Area: I.Menu.R, Sticky: true }).addButton({
            Type: 'toggle',
            Labels: {
                default: { default: `Share`, ja: `シェア` },
                active:  { default: `Close Share-Menu`, ja: `シェアメニューを閉じる` }
            },
            Help: true,
            Icon: `<span class="bibi-icon bibi-icon-share"></span>`
        }),
        id: 'bibi-subpanel_share',
        open: () => {
            sML.each(this.querySelectorAll('.parent-title'), () => { this.innerHTML = U['parent-title']; });
            sML.each(this.querySelectorAll('.book-title'), () => { this.innerHTML = document.title; });
        },
        getShareURI: (ParentOrBook, SNS) => {
            let ShareTitle = '', ShareURI = '';
            switch(ParentOrBook) {
                case 'Parent': ShareTitle = U['parent-title'], ShareURI = U['parent-uri']; break;
                case 'Book':   ShareTitle = document.title,    ShareURI = O.ReadiedURL;    break;
            }
            switch(SNS) {
                case 'Twitter': return 'https://twitter.com/intent/tweet?url='   + encodeURIComponent(ShareURI) + '&text=' + encodeURIComponent(ShareTitle) + '&hashtags=bibipub'; break;
                case 'Facebook': return 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(ShareURI); break;
                case 'Google+': return 'https://plus.google.com/share?url='   + encodeURIComponent(ShareURI); break;
            }
            return '';
        }
    });
    const getShareButton = (ParentOrBook, SNS, onclick) => {
        const ButtonObject = {
            Type: 'link',
            Labels: { default: { default: SNS } },
            Icon: `<span class="bibi-icon bibi-icon-${ SNS.replace('+', 'Plus') }"></span>`,
            href: '',
            target: '_blank',
            action: function() {
                this.href = ShareSubPanel.getShareURI(ParentOrBook, SNS);
            }
        };
        if(!O.Touch && SNS != 'Twitter') {
            let N = '_blank', W = 560, H = 500;
            switch(SNS) {
                case 'Facebook': N = 'FBwindow', H = 480; break;
                case 'Google+' : N = 'G+window', W = 400; break;
            }
            ButtonObject.on = {
                click: function(Eve) {
                    Eve.preventDefault();
                    window.open(encodeURI(decodeURI(this.href)), N, 'width=' + W + ', height=' + H + ', menubar=no, toolbar=no, scrollbars=yes');
                    return false;
                }
            };
        }
        return ButtonObject;
    };
    if(U['parent-uri']) {
        ShareSubPanel.addSection({
            Labels: { default: { default: `Share the Embedded Webpage`, ja: `埋め込まれたページをシェア` } },
            ButtonGroup: {
                Tiled: true,
                Buttons: [
                    getShareButton('Parent', 'Twitter'),
                    getShareButton('Parent', 'Facebook'),
                    getShareButton('Parent', 'Google+')
                ]
            }
        }).querySelector('.bibi-h-label').appendChild(sML.create('small', { className: 'parent-title' }));
    }
    if(true) {
        ShareSubPanel.addSection({
            Labels: { default: { default: `Share This Book`, ja: `この本をシェア` } },
            ButtonGroup: {
                Tiled: true,
                Buttons: [
                    getShareButton('Book', 'Twitter'),
                    getShareButton('Book', 'Facebook'),
                    getShareButton('Book', 'Google+')
                ]
            }
        }).querySelector('.bibi-h-label').appendChild(sML.create('small', { className: 'book-title' }));
    }
    /*
    if(S['allow-embedding-in-other-webpages']) {
        const EmbedCode = [
            `<a href="${ O.RequestedURL }" data-bibi="embed">${ U['parent-bibi-label'] ? U['parent-bibi-label'] : document.title }</a>`,
            `<script src="${ U['parent-pipi-path'] ? U['parent-pipi-path'] : O.RootPath.replace(/\/$/, '.js') }"></script>`
        ].join('').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        ShareSubPanel.addSection({
            Labels: { default: { default: `Embed-Code of This Book`, ja: `この本の埋め込みコード` } },
            Notes: [
                { default: { default: `<input class="code block" value="${ EmbedCode.replace(/['']/g, '&quot;') }" onclick="this.select();" />` } }
            ]
        });
    }
    */
    O.Head.appendChild(sML.create('script', { async: 'async', src: '//platform.twitter.com/widgets.js' }));

});