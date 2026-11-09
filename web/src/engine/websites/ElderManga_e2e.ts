import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eldermanga',
        title: 'ElderManga'
    },
    container: {
        url: 'https://eldermanga.com/manga/perileri-somurerek-gucleniyorum',
        id: 'perileri-somurerek-gucleniyorum',
        title: 'Perileri Sömürerek Güçleniyorum!'
    },
    child: {
        id: '/manga/perileri-somurerek-gucleniyorum/1-bolum-oku',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 48_464,
        type: 'image/avif'
    }
}).AssertWebsite();