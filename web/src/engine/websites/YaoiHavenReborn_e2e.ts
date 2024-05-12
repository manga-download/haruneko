import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yaoihavenreborn',
        title: 'Yaoi Haven Reborn'
    },
    container: {
        url: 'https://www.yaoihavenreborn.com/doujinshi/theredfish-lick-it-up-eng/',
        id: '/doujinshi/theredfish-lick-it-up-eng/',
        title: 'Lick It up'
    },
    child: {
        id: '/doujinshi/theredfish-lick-it-up-eng/',
        title: 'Lick It up'
    },
    entry: {
        index: 0,
        size: 337_799,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());