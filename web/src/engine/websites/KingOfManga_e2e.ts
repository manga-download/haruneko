import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kingofmanga',
        title: 'KingOfManga'
    },
    container: {
        url: 'https://kingofmanga.com/manga/8016922125-tale-of-a-scribe-who-retires-to-the-countryside/',
        id: '/manga/8016922125-tale-of-a-scribe-who-retires-to-the-countryside/',
        title: 'Tale of a Scribe Who Retires to the Countryside',
        timeout: 20000
    },
    child: {
        id: '/4195316865-tale-of-a-scribe-who-retires-to-the-countryside-0/',
        title: 'الفصل 0'
    },
    entry: {
        index: 1,
        size: 331_939,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());