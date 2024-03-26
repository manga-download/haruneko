import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bontoon',
        title: 'Bontoon'
    },
    container: {
        url: 'https://www.bontoon.com/detail/bt_1110866',
        id: 'bt_1110866',
        title: 'Amis au Départ'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 531_808,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());