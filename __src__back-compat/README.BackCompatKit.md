

[en] How to use the same URLs as before v1.0.0 to publish books on the web.
================================================================================================

The folder structure has changed in Bibi v1.0.0, and the URL for publishing books has changed accordingly.
But don't worry. You still can use not only the new style URL but also the same style URL as before.

Please try this way, if you already have publicated books on the web with BiB/i older than v1.0.0, and want to update Bibi to newer version, but do not want to or can not change the public URLs of the books.

1. At first, upload the new "bibi" folder to the same directory of the "bib" directory on your web server.
2. Next, Replace "index.html" file in the "bib/i" directory on your web server with the one in the new "bib/i" folder (If you haven't customized the "index.html" file, you can simply overwrite with new one).

Just by that, your Bibi is updated to the newest version, and ready to open your books via the same "https://your.server/bib/i/?book=***" style URL as before. There's no need to move EPUB data out of the "bib/bookshelf" directory.
What's more, you can also use the new "https://your.server/bibi/?book=****" style URL to open books stored in the "bibi-bookshelf" directory (this is the default method since Bibi v1.0.0).

If you interested in more info, read below too:
* The same new "bibi/presets/default.js" preset file is used in both old and new style URLs.
* If your old BiB/i is using customized old "bib/i/presets/default.js" preset file, and you want new Bibi to behave same as before, edit options one by one in the new preset file (Because the options in the preset file are renewed).
* You can use different preset file in each HTML by editing "src" attribute of script#bibi-preset element.
* You can change the path to the bookshelf directory by editing HTML or the preset file. The data-bibi-bookshelf attribute of script#bibi-preset element in HTML is prior than "bookshelf" option in the preset file.
* By combining these, various ways of installation and operation are possibles (for example, having share the same bookshelf directory with both old and new style URLs, or using different HTML or preset files for each book).


--------------------------------------------------------------------------------------------------------------------------------


[ja] v1.0.0 未満と同じ URL で、書籍をウェブ公開するには
================================================================================================

Bibi v1.0.0 でフォルダー構造が変更され、それに伴って書籍を発行するための URL も変更されました。
でもご安心を。新スタイルの URL だけでなく、これまでどおり旧スタイルの URL も使用できます。

もし、既に v1.0.0 よりも古い BiB/i で書籍をウェブ公開していて、Bibi は新しいバージョンに更新したいけれど、書籍の公開 URL は変更したくない・できない、というときは、この方法を試してください。

1. まず、新しい「bibi」フォルダを、ウェブサーバ上の「bib」ディレクトリと同じディレクトリにアップロードします。
2. 次に、ウェブサーバ上の「bib/i」ディレクトリにある「index.html」ファイルを、新しい「bib/i」フォルダ内にある「index.html」に交換します（「index.html」ファイルをカスタマイズしていなければ、単純に上書きしてかまいません）。

それだけで、Bibi は最新版に更新され、以前と同じ「https://your.server/bib/i/?book=***」形式の URL で本を開けるようになります。EPUB データを「bib/bookshelf」ディレクトリから移動する必要もありません。
しかも、新しい「https://your.server/bibi/?book=****」形式の URL を使用して「bibi-bookshelf」ディレクトリに保存された本を開くこともできます（これは、Bibi v1.0.0 以降のデフォルトの方法です）。

もし、より詳細な情報に興味があれば、以下もお読みください。
* 新しい「bibi/presets/default.js」プリセットファイルが、新旧両スタイルの URL で使用されます。
* 古い BiB/i がカスタマイズされた古い「bib/i/presets/default.js」プリセットファイルを使用していて、新しい Bibi にも同じように振る舞ってほしい場合は、新しいプリセットファイルでオプションを１つずつ編集してください（プリセットファイルのオプションが新しくなっているためです）。
* script#bibi-preset 要素の src 属性を編集することにより、各 HTML で異なるプリセットファイルを使用できます。
* HTML またはプリセットファイルを編集して、bookshelf ディレクトリへのパスを変更できます。HTMLの script#bibi-preset 要素の data-bibi-bookshelf 属性は、プリセットファイルの "bookshelf" オプションよりも優先されます。
* これらを組み合わせることで、多様な設置・運用方法が可能になります（たとえば、同じ bookshelf ディレクトリを新旧両スタイルの URL で共有したり、開く本ごとに異なる HTML やプリセットを用意したり）。
