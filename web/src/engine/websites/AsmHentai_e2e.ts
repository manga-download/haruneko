import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asmhentai',
        title: 'AsmHentai'
    },
    container: {
        url: 'https://asmhentai.com/g/166663/',
        id: '/g/166663/',
        title: '(Mimiket 10) [LAST EDEN (Amane Mari)] Infinite Emotion (Fate/stay night) [Chinese]'
    },
    child: {
        id: '/g/166663/',
        title: '(Mimiket 10) [LAST EDEN (Amane Mari)] Infinite Emotion (Fate/stay night) [Chinese]'
    },
    entry: {
        index: 0,
        size: 176_931,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());