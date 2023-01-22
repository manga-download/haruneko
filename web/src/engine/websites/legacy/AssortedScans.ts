// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AssortedScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('assortedscans', `assortedscans`, 'https://assortedscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AssortedScans extends Connector {
    constructor() {
        super();
        super.id = 'assortedscans';
        super.label = 'assortedscans';
        this.tags = ['manga', 'english'];
        this.url = 'https://assortedscans.com';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '#series-title');
        const title = data['0'].text.trim();
        const id = uri.pathname + uri.search;
        return Manga(this, id, title);
    }

    async _getMangas() {
        const request = new Request(new URL('/reader/', this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'section.series h2.series-title a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim(),
            };
        });
    }

    async _getChapters(manga) {
        const id = this.getId(manga.id);
        const request = new Request(new URL(id, this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'div.chapter > a');
        return data
            .map(element => {
                return {
                    id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                    title: element.title
                };
            });
    }

    getId(url) {
        return url.match(/\/reader\/.*\/?/)[0];
    }

    async _getMaxSite(chapterId) {
        const id = this.getId(chapterId);
        const request = new Request(new URL(id + '1/', this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'li.dropdown-element.page-details:last-child a');
        const maxSite = data['0'].text.match(/Page (\d+)/)[1];
        return [id, parseInt(maxSite)];
    }

    async _getPages(chapter) {

        const id = this.getId(chapter.id);
        const request = new Request(new URL(id + '1/', this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'li.dropdown-element.page-details a');
        return data.map(element => {
            const maxPage = element.text.match(/Page (\d+)/)[1];
            return this.createConnectorURI(this.url + id + maxPage);
        });
    }

    async _handleConnectorURI(payload) {
        const request = new Request(payload, this.requestOptions);
        const data = await this.fetchDOM(request, 'source#page-image');
        const link = this.getAbsolutePath(data[0], request.url);
        const response = await fetch(link, this.requestOptions);
        const blob = await response.blob();
        const buffer = await this._blobToBuffer(blob);
        this._applyRealMime(buffer);
        return buffer;
    }
}
*/