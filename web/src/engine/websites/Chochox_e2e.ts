import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'chochox',
        title: 'Chochox'
    },
    container: {
        url: 'https://chochox.com/lisa-and-kai-pockicchi/',
        id: '/lisa-and-kai-pockicchi/',
        title: 'Lisa and Kai – Pockicchi'
    },
    child: {
        id: '/lisa-and-kai-pockicchi/',
        title: 'Lisa and Kai – Pockicchi'
    },
    entry: {
        index: 0,
        size: 112_206,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());