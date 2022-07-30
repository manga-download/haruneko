import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'azoraworld',
        title: 'ازورا مانجا (AZORA MANGA)'
    },
    container: {
        url: 'https://azoraworld.com/series/return-of-the-unrivaled-spear-knight/',
        id: JSON.stringify({ post: '36485', slug: '/series/return-of-the-unrivaled-spear-knight/' }),
        title: 'Return of The Unrivaled Spear Knight'
    },
    child: {
        id: '/series/return-of-the-unrivaled-spear-knight/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 757_319,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());