import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'maidscan',
        title: 'Maid Scan'
    }, /* Need login and $$, we should remove this site
    container: {
        url: 'https://empreguetes.wtf/obra/deus-tigre-de-jangsan-1',
        id: 'deus-tigre-de-jangsan-1',
        title: 'Deus tigre de Jangsan'
    },
    child: {
        id: '/capitulo/239389',
        title: 'Capítulo 37'
    },
    entry: {
        index: 4,
        size: 1_523_950,
        type: 'image/webp'
    }*/
}).AssertWebsite();