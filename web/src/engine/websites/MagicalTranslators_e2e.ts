import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'magicaltranslators',
        title: 'Magical Translators'
    },
    container: {
        url: 'https://mahoushoujobu.com/read/manga/Mahou-Shoujo-Bu-e-Youkoso/',
        id: 'Mahou-Shoujo-Bu-e-Youkoso',
        title: 'Mahou Shoujo Bu e Youkoso!'
    },
    child: {
        id: '2',
        title: 'Chapter 2'
    },
    entry: {
        index: 1,
        size: 631_943,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());