import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'worldmanhwas',
        title: 'WorldManhwas'
    },
    container: {
        url: 'https://worldmanhwas.zone/komik/young-maid/',
        id: JSON.stringify({ post: '2115', slug: '/komik/young-maid/' }),
        title: 'Young Maid'
    },
    child: {
        id: '/komik/young-maid/chapter-50/',
        title: 'Chapter 50'
    },
    entry: {
        index: 1,
        size: 766_435,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());