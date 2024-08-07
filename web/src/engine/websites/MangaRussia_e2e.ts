import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarussia',
        title: 'MangaRussia'
    },
    container: {
        url: 'https://www.mangarussia.com/manga/Дандадан.html',
        id: encodeURI('/manga/Дандадан.html'),
        title: 'Дандадан',
    },
    child: {
        id: encodeURI('/chapter/Дандадан+16+-+141+Переели+вкусняшек/4332724/'),
        title: '16 - 141 Переели вкусняшек',
    },
    entry: {
        index: 0,
        size: 752_216,//or 752_216
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());