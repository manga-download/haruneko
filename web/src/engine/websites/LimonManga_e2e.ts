import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'limonmanga',
        title: 'Limon Manga'
    },
    container: {
        url: 'https://limonmanga.com/manga/ilahi-yetenegimle-hizli-seviye-atliyorum',
        id: 'ilahi-yetenegimle-hizli-seviye-atliyorum',
        title: 'İlahi Yeteneğimle Hızlı Seviye Atlıyorum!'
    },
    child: {
        id: '/manga/ilahi-yetenegimle-hizli-seviye-atliyorum/33-bolum-oku',
        title: 'Bölüm 33'
    },
    entry: {
        index: 1,
        size: 69_289,
        type: 'image/avif'
    }
}).AssertWebsite();