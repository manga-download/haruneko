import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetURLBase64FromBytes } from '../BufferEncoder';

type APIResult = {
    result: string;
};
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://visorjpg.lat/_app/remote/xkl77u/';

    public constructor() {
        super('lectorjpg', 'VisorJPG', 'https://visorjpg.lat', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {

        const data = await this.FetchAPI<APIResult>('./getSeries', {
            genres: [],
            name: '',
            perPage: 28
        });

        console.log(data);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, payload: JSONObject): Promise<T> {
        const url = new URL(endpoint, this.apiUrl);
        url.searchParams.set('payload', this.EncodePayload(payload));
        const { result } = await FetchJSON<APIResult>(new Request(url));
        return new Parser(result).Parse();
    }

    private EncodePayload(payload: JSONObject): string {
        const serialized = this.Serialize(payload);
        return GetURLBase64FromBytes(new TextEncoder().encode(serialized));
    }
    /*
    private Serialize(obj: JSONObject): string {
        const keys = Object.keys(obj);
        const mapping = {};
        keys.forEach((key, index) => {
            mapping[key] = index + 1;
        });
        const values = keys.map(key => obj[key]);
        return JSON.stringify([mapping, ...values]);
    }*/
    /*
    private Deserialize(serialized: string): JSONObject {
        const parsed = JSON.parse(serialized);
        const mapping = parsed[0]; // { key: index }
        const values = parsed.slice(1); // [value1, value2, ...]

        const result: JSONObject = {};

        // Invert mapping: index -> key
        const indexToKey: { [index: number]: string } = {};
        for (const key in mapping) {
            indexToKey[mapping[key]] = key;
        }

        // Reconstruct the object
        Object.keys(indexToKey)
            .sort((a, b) => Number(a) - Number(b)) // ensure order by index
            .forEach((index, i) => {
                const key = indexToKey[Number(index)];
                result[key] = values[i];
            });
        return result;
    }*/
}
/*
class Parser {
    private data: JSONArray;
    private visited: Set<number> = new Set();

    constructor(jsonString: string) {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) {
            throw new Error("Input JSON must be an array at the top level");
        }
        this.data = parsed as JSONArray;
    }

    // ------------------ PARSING ------------------
    Parse(): JSONArray {
        this.visited.clear();
        return this.data.map((el, idx) => {
            if (!this.visited.has(idx)) {
                return this.ParseSubScramble(el);
            }
            return null;
        }).filter((el): el is JSONElement => el !== null) as JSONArray;
    }

    private ParseSubScramble(element: JSONElement): JSONElement {
        let parsed: JSONElement = element;

        if (typeof element === "number") {
            if (this.visited.has(element)) {
                return this.data[element];
            }
            this.visited.add(element);
            parsed = this.data[element];
        }

        if (Array.isArray(parsed)) {
            return parsed.map(el => this.ParseSubScramble(el)) as JSONArray;
        }

        if (parsed && typeof parsed === "object") {
            const result: JSONObject = {};
            for (const [key, value] of Object.entries(parsed)) {
                result[key] = this.ParseSubScramble(value);
            }
            return result;
        }

        return parsed;
    }

    // ------------------ SERIALIZING ------------------
    Serialize(obj: JSONObject | JSONArray): string {
        const refMap = new Map<JSONElement, number>();
        const serializedData: JSONArray = [];

        const SerializeSub = (value: JSONElement): JSONElement => {
            if (value === null || typeof value !== "object") {
                return value; // primitives
            }

            if (refMap.has(value)) {
                return refMap.get(value)!; // reference by index
            }

            const index = serializedData.length;
            serializedData.push(value);
            refMap.set(value, index);

            if (Array.isArray(value)) {
                return value.map(SerializeSub) as JSONArray;
            } else {
                const obj: JSONObject = {};
                for (const [k, v] of Object.entries(value)) {
                    obj[k] = SerializeSub(v);
                }
                return obj;
            }
        };

        SerializeSub(obj);

        return JSON.stringify(serializedData);
    }
}*/