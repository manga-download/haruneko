import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kagane',
        title: 'Kagane'
    },
    container: {
        url: 'https://kagane.org/series/3AZIZEQCID32DV05LAKIMRQRI5#dungeon-porter',
        id: '3AZIZEQCID32DV05LAKIMRQRI5',
        title: 'Dungeon Porter',
    },
    child: {
        id: '35ARKKN63PIPKCXAX54FSCZS35',
        title: 'Ep. 40 - Mimic Market'
    },
    entry: {
        index: 1,
        size: 0,
        type: 'image/png'
    }
}).AssertWebsite();