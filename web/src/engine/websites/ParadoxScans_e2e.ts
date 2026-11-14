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