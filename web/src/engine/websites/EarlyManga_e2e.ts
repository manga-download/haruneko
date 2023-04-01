import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'earlymanga',
        title: 'EarlyManga'
    },
    container: {
        url: 'https://earlym.org/manga/3104/i-took-over-the-demonic-ancestor',
        id: '{"id":3104,"slug":"i-took-over-the-demonic-ancestor"}',
        title: 'I Took Over the Demonic Ancestor'
    },
    child: {
        id: '{"id":303732,"slug":"44"}',
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 141_396,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());