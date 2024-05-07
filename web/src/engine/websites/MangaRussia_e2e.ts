import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarussia',
        title: 'MangaRussia'
    },
    container: {
        url: 'https://www.mangarussia.com/manga/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD.html',
        id: '/manga/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD.html',
        title: 'Дандадан',
    },
    child: {
        id: '/chapter/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD+16+-+141+%D0%9F%D0%B5%D1%80%D0%B5%D0%B5%D0%BB%D0%B8+%D0%B2%D0%BA%D1%83%D1%81%D0%BD%D1%8F%D1%88%D0%B5%D0%BA/4332724/',
        title: '16 - 141 Переели вкусняшек',
    },
    entry: {
        index: 0,
        size: 752_216,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());