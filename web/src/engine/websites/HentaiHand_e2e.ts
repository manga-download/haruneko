import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hentaihand',
        title: 'HentaiHand'
    },
    container: {
        url: 'https://hentaihand.com/en/comic/110-1-2-3-4-5-6-7-8-9',
        id: '110-1-2-3-4-5-6-7-8-9',
        title: '[大好き!!ビーチクン] ある女の日常… ポスター (うるし原智志「ある女の日常」コレクション1～10)'
    },
    child: {
        id: '110-1-2-3-4-5-6-7-8-9',
        title: '[大好き!!ビーチクン] ある女の日常… ポスター (うるし原智志「ある女の日常」コレクション1～10)'
    },
    entry: {
        index: 0,
        size: 264_729,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());