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
    /* All mangas are 18+ and unable to verify age without mobile / korean thing?
    child: {
        id: '1',
        title: '1화'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/webp'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());