import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'doujinhentai',
        title: 'DoujinHentai'
    },
    container: {
        url: 'https://doujinhentai.net/manga-hentai/tits-tits-tits',
        id: JSON.stringify({ slug: '/manga-hentai/tits-tits-tits' }),
        title: 'Tits! Tits! Tits!'
    },
    child: {
        id: '/manga-hentai/tits-tits-tits/wife-packed-beach',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 5_880_916,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());