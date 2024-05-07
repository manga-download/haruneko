import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tuttoanimemanga',
        title: 'Tuttoanimemanga'
    },
    container: {
        url: 'https://tuttoanimemanga.net/comics/one_piece',
        id: 'one_piece',
        title: 'One Piece'
    },
    child: {
        id: '/read/one_piece/it/ch/1104',
        title: 'Ch.1104'
    },
    entry: {
        index: 1,
        size: 1_131_431,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());