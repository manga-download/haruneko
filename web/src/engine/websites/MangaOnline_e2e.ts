import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaonline',
        title: 'Manga Online'
    }, /* Region Locked - pt-br
    container: {
        url: 'https://mangaonline.biz/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/capitulo/jujutsu-kaisen-capitulo-263/',
        title: 'Capítulo 263'
    },
    entry: {
        index: 0,
        size: 386_052,
        type: 'image/png'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());