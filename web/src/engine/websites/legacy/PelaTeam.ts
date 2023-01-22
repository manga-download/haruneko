// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PelaTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pelateam', `Pela Team`, 'https://pelateam.it' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PelaTeam extends Connector {

    constructor() {
        super();
        super.id = 'pelateam';
        super.label = 'Pela Team';
        this.tags = [ 'manga', 'italian' ];
        this.url = 'https://pelateam.it';
    }

    async _getMangas() {
        const request = new Request(new URL('/Computer/', this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'div.theList div.nomeserie > a');

        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink('/Computer/' + element.search, this.url),
                title: element.innerText.trim()
            };
        });
    }

    async _getChapters(manga) {
        const request = new Request(new URL(manga.id, this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'div.theList table tbody tr td table tbody tr td:nth-child(1) > a');

        return data.map(element => {
            if (element.search.length > 0) {
                return {
                    id: this.getRootRelativeOrAbsoluteLink('/Computer/' + element.search, this.url),
                    title: element.text.trim()
                };
            }
        }).filter(function( element ) {
            return element !== undefined;
        });
    }

    async _getPages(chapter) {
        const script = `
            new Promise((resolve, reject) => {
                try {
                    resolve(imageArray);
                } catch(error) {
                    reject(error);
                }
            });
        `;
        const request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        const data = await Engine.Request.fetchUI(request, script);

        return data.map(element => {
            return new URL('/Computer/' + encodeURI(element), this.url).href;
        });
    }
}
*/