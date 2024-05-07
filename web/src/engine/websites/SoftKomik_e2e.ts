import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'softkomik',
        title: 'Softkomik'
    },
    container: {
        url: 'https://softkomik.com/black-abyss-at-dawn-bahasa-indonesia',
        id: 'black-abyss-at-dawn-bahasa-indonesia',
        title: 'Black Abyss at Dawn'
    },
    child: {
        id: '028',
        title: '028'
    },
    entry: {
        index: 1,
        size: 348_548,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());