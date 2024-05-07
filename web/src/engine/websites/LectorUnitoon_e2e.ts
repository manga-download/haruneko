import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lectorunitoon',
        title: 'LectorUnitoon'
    },
    container: {
        url: 'https://lectorunitoon.com/manga/bastian',
        id: '/manga/bastian',
        title: 'Bastian'
    },
    child: {
        id: '/bastian-capitulo-17/',
        title: 'Chapter 17'
    },
    entry: {
        index: 1,
        size: 1_030_025,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());