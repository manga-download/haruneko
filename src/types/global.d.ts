// Global type declarations

// Allow importing .webp files as strings
declare module '*.webp' {
    const value: string;
    export default value;
}

// Allow importing .png files as strings
declare module '*.png' {
    const value: string;
    export default value;
}

// Allow importing .jpg files as strings
declare module '*.jpg' {
    const value: string;
    export default value;
}

// Allow importing .svg files as strings
declare module '*.svg' {
    const value: string;
    export default value;
}

// Allow importing .gif files as strings
declare module '*.gif' {
    const value: string;
    export default value;
}

// Global JSON types (used by the engine)
declare global {
    type JSONPrimitive = string | number | boolean | null;
    type JSONArray<T = JSONElement> = T[];
    type JSONObject<T = JSONElement> = { [key: string]: T };
    type JSONElement = JSONPrimitive | JSONObject | JSONArray;
}

export {};
