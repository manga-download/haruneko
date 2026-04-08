import { Tags } from '../Tags';
import icon from './PlotTwistNoFansub.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APISearchResult = {
    td_data: string;
};

const pageScript = `
    new Promise(resolve => {
        resolve(objetoglobal.images.map(image => {
            return objetoglobal.image_url + "/" + objetoglobal.title + "_" + objetoglobal.images[0].manga_id + "/ch_" + parseFloat(document.querySelector("select#chapter-select").value) + "/" + image.image_name;
        }));
    });
`;

const chapterScript = `
   new Promise(function (resolve, reject) {
       const element = document.createElement('div');
       document.body.appendChild(element);
       const chapterlist = [];

       // Turnstile wrapper
       function requestWithTurnstile(url, page) {
           return new Promise(function (resolve, reject) {
               turnstile.render(element, {
                   sitekey: cmrChListCfg.cfTs.siteKey,
                   callback: async function (token) {
                       try {
                           const res = await fetch(url, {
                               method: "POST",
                               headers: {
                                   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                   "X-Requested-With": "XMLHttpRequest"
                               },
                               body: new URLSearchParams({
                                   manga_id: cmrChListCfg.manid,
                                   nonce : cmrChListCfg.nonce_chapters,
                                   action: cmrChListCfg.chapters_action,
                                   pageNumber: page.toString(),
                                   "cf-turnstile-response" : token
                               }).toString()
                           });

                           if (!res.ok) throw new Error("HTTP " + res.status);

                           const json = await res.json();
                           resolve(json);
                       } catch (err) {
                           reject(err);
                       }
                   }
               });
           });
       }

       // Async IIFE for pagination
       (async function () {
           try {
               for (let page = 1; ; page++) {
                   const chaptersdata = await requestWithTurnstile('/wp-admin/admin-ajax.php', page);
                   if (chaptersdata.length === 0) break;

                   const chapters = chaptersdata
                       .map(function (item) {
                           return {
                               id: "/reader/" + item.post_name + "/chapter-"+ item.chapter_number + "/",
                               title: "Capítulo " + item.chapter_number + ": "+ new DOMParser().parseFromString(item.chapter_name, 'text/html').body.innerText.trim()
                           };
                       });

                   chapterlist.push(...chapters);
               }

               resolve(chapterlist);
           } catch (err) {
               reject(err);
           }
       })();
   });
`;

@Common.MangaCSS(/^{origin}\/plotwist\/manga\/[^/]+\/$/, 'p.htilestiloso')
@Common.ChaptersSinglePageJS(chapterScript, 2000)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('plottwistnofansub', 'Plot Twist No Fansub', 'https://plotnf.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of 'aeiouy'.split('')) {
            const mangas = await this.GetMangasFromLetter(provider, letter);
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    private async GetMangasFromLetter(provider: MangaPlugin, letter: string): Promise<Manga[]> {
        const uri = new URL('/wp-admin/admin-ajax.php', this.URI);
        const { td_data } = await FetchJSON<APISearchResult>(new Request(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                action: 'td_ajax_search',
                module: 'tdb_module_search',
                td_string: letter,
                limit: '9999'
            }).toString()
        }));

        const doc = new DOMParser().parseFromString(td_data, 'text/html');
        return [...doc.querySelectorAll<HTMLAnchorElement>('.entry-title a[href*="/plotwist/manga/"]')].map(manga => {
            const { id, title } = Common.AnchorInfoExtractor(true).call(this, manga, uri);
            return new Manga(this, provider, id, title);
        });
    }
}