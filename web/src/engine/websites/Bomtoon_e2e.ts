import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bomtoon',
        title: 'Bomtoon'
    },
    container: {
        url: 'https://www.bomtoon.com/detail/not_friend_all',
        id: 'not_friend_all',
        title: '친구말고 [개정판]'
    },
    child: {
        id: '1',
        title: '1화'
    },
    entry: {
        index: 0,
        size: 66_636,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());