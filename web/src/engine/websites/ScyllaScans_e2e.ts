import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scyllascans',
        title: 'Scylla Scans'
    },
    container: {
        url: 'https://scyllascans.org/work/en/alya_sometimes_hides_her_feelings_in_russian',
        id: JSON.stringify({
            id: 77,
            language: 2,
            stub: 'alya_sometimes_hides_her_feelings_in_russian'

        }),
        title: 'Alya Sometimes Hides Her Feelings in Russian [en]'
    },
    child: {
        id: '1456',
        title: 'Vol. 0 Ch. 19.0 - Stop! Don\'t Fight Over Me! (4)'
    },
    entry: {
        index: 1,
        size: 1_776_832,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());