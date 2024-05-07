import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manganexus',
        title: 'MangaNexus'
    },
    container: {
        url: 'https://manganexus.net/manga/the-return-of-the-iron-blood-sword-hound-17339',
        id: 'the-return-of-the-iron-blood-sword-hound-17339',
        title: 'The Return of the Iron-Blood Sword Hound'
    },
    child: {
        id: '1',
        title: 'Capítulo 1'
    },
    /* Cant get picture, chances are its geoblocked by CF // TODO: FIX the test with picture
    entry: {
        index: 0,
        size: 188_488,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());