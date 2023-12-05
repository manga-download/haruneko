import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ghostfansub',
        title: 'Ghost Fansub'
    },
    /* Irrelevant because you need to be logged
    container: {
        url: 'https://ghostfansub.online/manga/breathing-the-same-hair/',
        id: JSON.stringify({ post: '1841', slug: '/manga/breathing-the-same-hair/' }),
        title: 'Breathing the Same Air'
    },
    child: {
        id: '/manga/breathing-the-same-air/bolum-7/',
        title: 'Bölüm 7'
    },

    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());