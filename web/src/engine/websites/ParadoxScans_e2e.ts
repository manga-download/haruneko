import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'paradoxscans',
        title: 'Paradox Scans'
    },
    container: {
        url: 'https://paradoxscans.com/seri/buyucu-coban/',
        id: '/seri/buyucu-coban/',
        title: 'Büyücü Çoban'
    },
    child: {
        id: '/seri/buyucu-coban/bolum-8/',
        title: 'Bölüm 8'
    },
    entry: {
        index: 0,
        size: 985_497,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'paradoxscans',
        title: 'Paradox Scans'
    },
    container: {
        url: 'https://paradoxscans.com/seri/vahsi-vampir-kralinin-varisi/',
        id: '/seri/vahsi-vampir-kralinin-varisi/',
        title: 'Vahşi Vampir Kralının Varisi'
    },
    child: {
        id: '/seri/vahsi-vampir-kralinin-varisi/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 791_384,
        type: 'image/webp'
    }
}).AssertWebsite();