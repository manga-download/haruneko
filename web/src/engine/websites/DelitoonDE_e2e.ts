import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'delitoonde',
        title: 'Delitoon (German)'
    },
    container: {
        url: 'https://www.delitoon.de/detail/dad_4100016',
        id: 'dad_4100016',
        title: 'Wie werde ich meinen Verlobten los?'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 796_370,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());