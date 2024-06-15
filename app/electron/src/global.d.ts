declare type JSONElement = null | boolean | number | string | JSONArray | JSONObject;
declare interface JSONObject<T extends JSONElement = JSONElement> extends Record<string, T> {}
declare interface JSONArray<T extends JSONElement = JSONElement> extends Array<T> {}