import { Tags } from '../Tags';
import icon from './XXXYaoi.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomInt, RandomText } from '../Random';

type APIMangas = {
    data: {
        html: string;
        total_pages: number;
        current_page: number;
    };
};

@Common.MangaCSS(/^{origin}\/bl\/[^/]+\/$/, 'span.xyaoi-breadcrumb-current')
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('ul.xyaoi-chapters-ul li a')].map(anchor => ({id: anchor.pathname, title: anchor.querySelector('div header span').textContent.trim()}));`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xxxyaoi', 'XXXYaoi', 'https://3xyaoi.com', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const eventName = RandomText(8 * RandomInt(4) + 1);
        //doing that with a script, so the cookie is set by the page (one less script call)
        const config = await FetchWindowPreloadScript<Array<string | number>>(new Request(new URL('/biblioteca/', this.URI)), `
            (() => {
	            function decodeArray() {
		            const container = document.querySelector('#xyaoi-cards-container');
		            let config = [];
		            for (const attr of container.attributes) {
			            try {
				            const value = JSON.parse(atob(container.getAttribute(attr.name)).split('').reverse().join(''));
				            if (Array.isArray(value)) {
					            config = value;
                                cookieStore.setItem(config[8], config[9]);
					            break;
				            }
			            } catch {}
		            }

		            setInterval(() => {
			            window.dispatchEvent(new CustomEvent('${eventName}', {
				            detail: config
			            }));
		            }, 200);

	            }

	            document.addEventListener('DOMContentLoaded', decodeArray);

            })();
        `, `
        new Promise(resolve => {
            window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
        })`);

        // config array indexes:
        /*
            csrfName, // index 0
            csrfVal, // index 1
            pValKey, // index 2
            pageMult, // index 3
            _searchMult, // index 4
            _statusMult, // index 5
            _genreMult, // index 6
            baseOffset, // index 7
            _cookieName, // index 8
            _cookieVal // index 9
        */

        const [csrfName, csrfVal, pValKey, pageMult, , , , baseOffset] = config;

        const form = new FormData();
        form.append('action', 'xyaoi_library_filter');
        form.append(`${csrfName}`, `${csrfVal}`);
        form.append('search', '');
        form.append('status', '');
        form.append('genre', '');
        form.append('orderby', 'latest');
        form.append('criador', '0');

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                form.set(`${pValKey}`, `${page * Number(pageMult) + Number(baseOffset)}`);
                form.set('page', `${page}`);
                const { data: { html, total_pages: total } } = await FetchJSON<APIMangas>(new Request(new URL(`wp-admin/admin-ajax.php`, this.URI), {
                    method: 'POST',
                    body: form
                }));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const elements = [...doc.querySelectorAll<HTMLAnchorElement>('div.xyaoi-card-details > :first-child a')];
                const mangas = elements.map(({ pathname, textContent }) => new Manga(this, provider, pathname, textContent.trim()));
                yield* mangas;
                run = page < total;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowPreloadScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            (() => {
                function conceal(obj, key, intercept) {
                    function toString() {
                        return 'function ' + this.name + '() { [native code] }';
                    }
                    Object.defineProperty(toString, 'toString', {value: toString,writable: false,enumerable: false});
                    Object.defineProperty(toString, 'prototype', {value: undefined,writable: false,enumerable: false,});
                    obj[key] = new Proxy(obj[key], {
                        get(target, key, receiver) {
                            return key === 'toString' ? toString : Reflect.get(target, key);
                        },
                        apply: intercept,
                    });
                }

                // DISABLE ANTI ADBLOCK DEFENSES

                conceal(window, 'fetch', (target, thisArg, args) => {
                    const [resource, config] = args;
                    const url = typeof resource === 'string' ? resource : resource.url;
                    if (url.match(/googlesyndication|doubleclick/)) {
                        return Promise.resolve(new Response(null, { status: 200 }));
                    }
                    return Reflect.apply(target, thisArg, args);
                });

                conceal(Node.prototype, 'appendChild', (target, thisArg, args) => {
                    const [node] = args;
                    if (node.nodeName === 'SCRIPT' && node.src.match('googlesyndication|doubleclick')) {
                        node.type = 'text/plain';
                        node.src = '';
                    }
                    return Reflect.apply(target, thisArg, args);
                });

                Object.defineProperty(window, '_antiBurlaExecuted', {
                    get: () => true,
                    set: (value) => {},
                    configurable : true
                });

            })();
        `, `[...document.querySelectorAll('div.reading-content img.img-responsive')].map(img=> img.src)`, 1500);
        return images.map(src => new Page(this, chapter, new URL(src, this.URI)));
    }

}