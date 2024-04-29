import type { HakuNeko } from './engine/HakuNeko';

declare global {
    type JSONElement = null | boolean | number | string | JSONArray | JSONObject;
    type JSONArray = JSONElement[];
    type JSONObject = {
        [member: string]: JSONElement;
        [member: number]: never;
        [member: symbol]: never;
    };

    var HakuNeko: HakuNeko;
    interface Window {
        HakuNeko: HakuNeko;
    }
}