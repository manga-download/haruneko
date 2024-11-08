// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicBoost.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

const pagesScript = `
   new Promise(async (resolve, reject) => {
       try {
           const a2f = NFBR.a2F ? new NFBR.a2F() : new NFBR.a2f();//StaticServer
           const params = new URL(window.location).searchParams;
           const parameters = await a2f.a5W({
               contentId: params.get(NFBR.a5q.Key.CONTENT_ID), // Content ID => 'cid'
               a6m: params.get(NFBR.a5q.Key.LICENSE_TOKEN), // License Token => 'lit'
               preview: params.get(NFBR.a5q.Key.LOOK_INSIDE) === '1', // Look Inside => 'lin'
               contentType: params.get(NFBR.a5q.Key.CONTENT_TYPE) || 1, // Content Type => 'cty'
               title: params.get(NFBR.a5q.Key.CONTENT_TITLE), // Content Title => 'cti'
               winWidth: 3840,
               winHeight: 2160
           });

           //Create a model
           const model = new NFBR.a6G.Model({
               'settings': new self.NFBR.Settings('NFBR.SettingData'),
               'viewerFontSize': self.NFBR.a0X.a3k,
               'viewerFontFace': self.NFBR.a0X.a3k,
               'viewerSpreadDouble': true,
               'viewerb5c': null,
               'viewerSpread': {},
               'queryParamForContentUrl' : parameters.contentAppendParam,
           });

           //Create a "Content" that will be filled using the bookloader as5 async function
           const content = new NFBR.a6i.Content(parameters.url);
           const v_a6L = new NFBR.a6G.a6L(model); //a6G.a6L : class with 'POPUP_NAME_URL'
           await v_a6L.bookLoader_.a5s(content, 'configuration', v_a6L);

           const pages = content.configuration.contents.map((page, index) => {
               let mode = 'raw';
               let extension = '.jpeg';

               //*****************/
               //GETTING PAGE URL
               //*****************/
               //Create a Page
               const fPage = new NFBR.a6i.Page(index, page.file, "0", extension, "");
               const realURL = v_a6L.a6T(content, fPage); //get real URL, may change depending on publus version

               //*****************************/
               //GETTING IMAGE SCRAMBLE DATA
               //*****************************/

               //Fill infos in the page for a7b to work
               const fileinfos = content.files[index].FileLinkInfo.PageLinkInfoList[0].Page;
               fPage.width = fileinfos.Size.Width;
               fPage.height = fileinfos.Size.Height;
               fPage.info = fileinfos;
               //Fill more infos needed for  unscrambling
               fPage.a7b(content); // function names depends on publus version

               let blocks = [];
               if (fileinfos.BlockHeight) //if we have a block size for the page, its a puzzle !
               {
                   mode = 'puzzle';
                   blocks = window.NFBR.a6G.a5x.prototype.b0Q(fPage, fPage.width, fPage.height);
               }

               return {
                   mode: mode,
                   imageUrl: realURL,
                   encryption: {
                       blocks: blocks,
                   }
               };
           });
           resolve(pages);

       } catch (error) {
           reject(error);
       }
   });
`;

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicnettai', `Comic Nettai`, 'https://www.comicnettai.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicBoost extends Publus {

    constructor() {
        super();
        super.id = 'comicboost';
        super.label = 'comicブースト (Comic Boost)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-boost.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'article#book div.detail h1.name');
        let id = uri.pathname + uri.search;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/series?per=1000', this.url), this.requestOptions );
        let data = await this.fetchDOM(request, 'div.box ul li div.info p.name a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions );
        let data = await this.fetchDOM(request, 'section#productList ul.list_item--series li div.product_item ul.box_button li a.button');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.closest('div.product_item').querySelector('p.name').textContent.trim(),
                language: ''
            };
        });
    }
}
*/