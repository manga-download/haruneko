import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lumoskomik',
        title: 'LumosKomik'
    },
    container: {
        url: 'https://lumoskomik.com/komik/the-tales-of-heaven-and-earth/',
        id: JSON.stringify({ post: '8190', slug: '/komik/the-tales-of-heaven-and-earth/'}),
        title: 'The Tales of Heaven And Earth'
    },
    child: {
        id: '/komik/the-tales-of-heaven-and-earth/chapter-6/',
        title: 'Chapter 6'
    },
    entry: {
        index: 0,
        size: 204_896,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());