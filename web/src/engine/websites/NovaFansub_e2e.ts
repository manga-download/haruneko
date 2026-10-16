import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novafansub',
        title: 'Nova Fansub',
    },
    container: {
        url: 'https://novafansub2.site/seri/my-sadistic-master/',
        id: '/seri/my-sadistic-master/',
        title: 'My Sadistic Master'
    }, /* Login needed
    child: {
        id: '/bolum/my-sadistic-master-28-bolum/',
        title: '28. Bölüm'
    },
    entry: {
        index: 1,
        size: 139_976,
        type: 'image/webp'
    }*/
}).AssertWebsite();