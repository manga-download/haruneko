﻿import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configNotScrambled: Config = {
    plugin: {
        id: '18comic',
        title: '18comic'
    }, /* CloudFlare
    container: {
        url: 'https://18comic.org/album/286/',
        id: '/album/286/',
        title: '[沒有漢化][ゲズンタイト]HARWEST(COMIC クリベロン 2018年2月号 Vol.64)'
    },
    child: {
        id: '/photo/286/',
        title: '[沒有漢化][ゲズンタイト]HARWEST(COMIC クリベロン 2018年2月号 Vol.64)'
    },
    entry: {
        index: 0,
        size: 188_690,
        type: 'image/webp'
    }*/
};

const fixtureNotScrambled = new TestFixture(configNotScrambled);
describe(fixtureNotScrambled.Name, async () => (await fixtureNotScrambled.Connect()).AssertWebsite());

const configScrambled: Config = {
    plugin: {
        id: '18comic',
        title: '18comic'
    }, /* CloudFlare
    container: {
        url: 'https://18comic.org/album/557769/',
        id: '/album/557769/',
        title: '上流社會～我要成為人生勝利組～ [禁漫漢化組]'
    },
    child: {
        id: '/photo/557769/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 66_916,
        type: 'image/png'
    }*/
};

const fixtureScrambled = new TestFixture(configScrambled);
describe(fixtureScrambled.Name, async () => (await fixtureScrambled.Connect()).AssertWebsite());