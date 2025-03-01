import { TestFixture } from '../../../test/WebsitesFixture';

//CASE : Different subdomain
new TestFixture({
    plugin: {
        id: 'mangabat',
        title: 'MangaBat'
    },
    container: {
        url: 'https://readmangabat.com/read-jv387640',
        id: 'https://readmangabat.com/read-jv387640',
        title: 'The Devil Ring',
    },
    child: {
        id: 'https://readmangabat.com/read-jv387640-chap-162',
        title: 'Chapter 162'
    },
    entry: {
        index: 1,
        size: 232_046,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//CASE : same subdomain
new TestFixture({
    plugin: {
        id: 'mangabat',
        title: 'MangaBat'
    },
    container: {
        url: 'https://h.mangabat.com/read-fq409735',
        id: '/read-fq409735',
        title: 'Kyouichi',
    },
    child: {
        id: '/read-fq409735-chap-5',
        title: 'Vol.1 Chapter 5: Loop.2 - Reproduction'
    },
    entry: {
        index: 0,
        size: 204_308,
        type: 'image/jpeg'
    }
}).AssertWebsite();