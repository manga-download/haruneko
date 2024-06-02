import type { HakuNeko } from './engine/HakuNeko';

declare global {
    type JSONElement = null | boolean | number | string | JSONArray | JSONObject;
    interface JSONObject<T extends JSONElement = JSONElement> extends Record<string, T> {}
    interface JSONArray<T extends JSONElement = JSONElement> extends Array<T> {}

    var HakuNeko: HakuNeko;
    interface Window {
        HakuNeko: HakuNeko;
    }
}