import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'saficizgi',
        title: 'Safi Çizgi',
    },
    container: {
        url: 'https://saficizgi.com/seri/otaku-ni-yasashii-gal-wa-inai-',
        id: JSON.stringify({ slug: 'otaku-ni-yasashii-gal-wa-inai-', id: 'nw14kg2d43xdze1' }),
        title: 'Gallar Otaku’ya Karşı Nazik Olamaz Mı!?'
    },
    child: {
        id: JSON.stringify({ slug: '7', id: '1wbxfnorh96f8396k5iqv9j4adw5q1'}),
        title: 'Bölüm 7'
    },
    entry: {
        index: 4,
        size: 1_696_332,
        type: 'image/png'
    }
}).AssertWebsite();