import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rawdevart',
        title: 'RawDevart'
    },
    container: {
        url: 'https://endevart.com/comic/ca460be0-15c4-426c-a35f-4b6db35b7d49',
        id: 'ca460be0-15c4-426c-a35f-4b6db35b7d49',
        title: 'Kono Gomi o Nanto Yobu'
    },
    child: {
        id: 'cf62cc17-e5c5-4aaa-a469-d32189b9134a',
        title: 'Chapter 21'
    },
    entry: {
        index: 0,
        size: 1_179_102,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());