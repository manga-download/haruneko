import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://translate.webtoons.com/translate/status?webtoonNo=109&episodeNo=458&teamVersion=0&language=ARA',
        id: '/en/romance/lore-olympus/list?title_no=1320' ,
        title: 'Lore Olympus',
    },
    child: {
        id: '/en/romance/lore-olympus/s3-episode-250/viewer?title_no=1320&episode_no=255',
        title: '#255 - (S3) Episode 250',
    },
    entry: {
        index: 1,
        size: 39_553,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());