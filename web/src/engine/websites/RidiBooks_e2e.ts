import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ridibooks',
        title: 'RidiBooks'
    },
    container: {
        url: 'https://ridibooks.com/books/5207000001',
        id: '5207000001',
        title: '품격을 배반한다',
        timeout: 10000
    },
    child: {
        id: '5207000001',
        title: '프롤로그'
    },
    entry: {
        index: 0,
        size: 164_679,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());