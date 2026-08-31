import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kairatoon',
        title: 'Kairatoon'
    },
    container: {
        url: 'https://kairatoon.com/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim',
        id: 'abce9e85-63cc-40bf-8f77-adba13916ade',
        title: 'Ben İlahi Siyah Ejderha’nın İmugisiyim!'
    },
    child: {
        id: '54eace61-1236-4c6d-88ca-932caf0a50b7',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 218_292,
        type: 'image/webp'
    }
}).AssertWebsite();