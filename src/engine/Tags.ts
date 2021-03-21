export class Tag {

    public readonly Category: string;

    public constructor(category: string, ... keys: string[]) {
        this.Category = category;
    }
}

export const Tags = {
    Language: 'tag.group.language',
    Media: 'tag.group.media'
};

export const Languages = {
    Multi: 'tag.group.language.multilingual',
    EN: 'tag.group.language.english',
    ES: 'tag.group.language.spanish',
    PT: 'tag.group.language.portuguese',
    FR: 'tag.group.language.french',
    DE: 'tag.group.language.german',
    ID: 'tag.group.language.indonesian',
    ZH: 'tag.group.language.chinese'
};

export const Media = {
    Manga: 'tag.group.media.manga',
    Manhua: 'tag.group.media.manhua',
    Manhwa: 'tag.group.media.manhwa',
    Comic: 'tag.group.media.comic',
    Anime: 'tag.group.media.anime',
    Novel: 'tag.group.media.novel'
};

export const Foo = {
    Aggregator: '',
    Scanlator: ''
};