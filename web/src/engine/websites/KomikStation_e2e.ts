import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komikstation',
        title: 'KomikStation'
    },
    container: {
        url: 'https://komikstation.co/manga/hack-g-u/',
        id: '/manga/hack-g-u/',
        title: '.hack//G.U.+'
    },
    child: {
        id: '/hack-g-u-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 110_866,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());