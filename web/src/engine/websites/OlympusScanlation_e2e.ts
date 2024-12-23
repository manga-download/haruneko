import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'olympusscanlation',
        title: 'Olympus Scanlation'
    },
    container: {
        url: 'https://olympuscomic.com/series/comic-el-mago-devorador-de-talentos13424',
        id: JSON.stringify({ slug: 'el-mago-devorador-de-talentos13424', type: 'comic' }),
        title: 'El Mago Devorador de Talentos'
    },
    child: {
        id: '92283',
        title: '71'
    },
    entry: {
        index: 1,
        size: 509_644,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();