import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'readmng',
        title: 'ReadMangaToday'
    },
    container: {
        url: 'https://www.readmng.com/please-dont-bully-me-nagatoro',
        id: '/please-dont-bully-me-nagatoro',
        title: 'Please don\'t bully me, Nagatoro'
    },
    child: {
        id: '/please-dont-bully-me-nagatoro/136',
        title: 'Chapter 136'
    },
    entry: {
        index: 0,
        size: 223_118,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());