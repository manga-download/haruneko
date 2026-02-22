import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'limonmanga',
        title: 'Limon Manga'
    },
    container: {
        url: 'https://limonmanga.com/manga/20/ilahi-yetenegimle-hizli-seviye-atliyorum',
        id: '/manga/20/ilahi-yetenegimle-hizli-seviye-atliyorum',
        title: 'İlahi Yeteneğimle Hızlı Seviye Atlıyorum!'
    },
    child: {
        id: '/manga/20/ilahi-yetenegimle-hizli-seviye-atliyorum/661/33-bolum',
        title: 'Bölüm 33'
    },
    entry: {
        index: 1,
        size: 646_156,
        type: 'image/jpeg'
    }
}).AssertWebsite();