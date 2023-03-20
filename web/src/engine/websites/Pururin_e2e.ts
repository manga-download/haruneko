import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pururin',
        title: 'Pururin'
    },
    container: {
        url: 'https://pururin.to/gallery/65780/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        id: '/gallery/65780/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        title: 'The Rough Tempered Big Breasted Pirate Who\'s Addicted To Sex'
    },
    child: {
        id: '/gallery/65780/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        title: 'The Rough Tempered Big Breasted Pirate Who\'s Addicted To Sex'
    },
    entry: {
        index: 0,
        size: 1_775_122,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());