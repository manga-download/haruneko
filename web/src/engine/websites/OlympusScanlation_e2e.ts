import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'olympusscanlation',
        title: 'Olympus Scanlation'
    },
    container: {
        url: 'https://olympusv2.gg/series/comic-jugador-devorador-de-acero',
        id: JSON.stringify({ slug: 'jugador-devorador-de-acero', type: 'comic' }),
        title: 'Jugador devorador de acero'
    },
    child: {
        id: '74801',
        title: '1'
    },
    entry: {
        index: 0,
        size: 243_244,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());