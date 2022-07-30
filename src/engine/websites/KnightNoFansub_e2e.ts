import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'knightnofansub',
        title: 'Knight no Fansub'
    },
    container: {
        url: 'https://knightnoscanlation.com/sr/infinite-level-up-in-murim/',
        id: JSON.stringify({ post: '3954', slug: '/sr/infinite-level-up-in-murim/' }),
        title: 'Infinite Level up in Murim'
    },
    child: {
        id: '/sr/infinite-level-up-in-murim/capitulo-01/',
        title: 'Capitulo 01'
    },
    entry: {
        index: 0,
        size: 2_703_474,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());