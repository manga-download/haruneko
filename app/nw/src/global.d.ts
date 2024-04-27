declare type JSONElement = null | boolean | number | string | JSONArray | JSONObject;
declare type JSONArray = JSONElement[];
declare type JSONObject = {
    [member: string]: JSONElement;
    [member: number]: never;
    [member: symbol]: never;
};