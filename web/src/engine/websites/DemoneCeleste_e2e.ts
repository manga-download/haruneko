import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'demoneceleste',
        title: 'Demone Celeste'
    },
    container: {
        url: 'https://www.demoneceleste.it/manga/a-place-further-than-the-universe/',
        id: '/manga/a-place-further-than-the-universe/',
        title: 'A Place Further Than the Universe'
    },
    child: {
        id: '/manga/a-place-further-than-the-universe/1/',
        title: '1 # Un milione di yen per la gioventù'
    },
    entry: {
        index: 2,
        size: 867_150,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());