import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lxhentai',
        title: 'LxHentai (Hentai LXX)'
    },
    container: {
        url: 'https://lxmanga.net/truyen/nu-than-ke-ben',
        id: '/truyen/nu-than-ke-ben',
        title: 'Nữ thần kế bên'
    },
    child: {
        id: '/truyen/nu-than-ke-ben/chapter-65',
        title: 'Chapter 65'
    },
    entry: {
        index: 0,
        size: 826_734,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());