import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lxhentai',
        title: 'LxHentai (Hentai LXX)'
    },
    container: {
        url: 'https://lxmanga.click/truyen/nu-than-ke-ben',
        id: '/truyen/nu-than-ke-ben',
        title: 'Nữ thần kế bên'
    },
    child: {
        id: '/truyen/nu-than-ke-ben/chapter-65',
        title: 'Chapter 65'
    },
    entry: {
        index: 0,
        size: 814_382,
        type: 'image/jpeg',
        timeout: 10000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());