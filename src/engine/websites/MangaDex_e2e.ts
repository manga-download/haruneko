import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadex',
        title: 'MangaDex'
    },
    container: {
        url: 'https://mangadex.org/title/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/solo-leveling',
        id: '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
        title: 'Solo Leveling'
    },
    child: {
        id: '306606ed-9272-40d7-9534-c552d7e13f32',
        title: 'Vol.01 Ch.0000 - Prologue (en) [Flame Scans]'
    },
    entry: {
        index: 0,
        size: 967_059,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());