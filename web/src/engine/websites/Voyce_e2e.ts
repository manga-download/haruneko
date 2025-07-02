import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'voyce',
        title: 'Voyce',
    },
    container: {
        url: 'https://www.voyce.me/series/death-speed',
        id: 'death-speed',
        title: 'Death Speed'
    },
    child: {
        id: '18088',
        title: 'Episode 0: Prologue'
    },
    entry: {
        index: 1,
        size: 553_910,
        type: 'image/jpeg'
    }
}).AssertWebsite();