import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'MerlinToon'
    },
    container: {
        url: 'https://merlintoon.com/seri/akademinin-dehasi',
        id: '/seri/akademinin-dehasi',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '48a11203-5c30-4eb2-bc06-94c25e038926/65',
        title: 'Bölüm 65'
    },
    entry: {
        index: 1,
        size: 247_508,
        type: 'image/webp'
    }
}).AssertWebsite();