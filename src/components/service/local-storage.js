export const setItem = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
    const item = window.localStorage.getItem(key);

    try {
        return JSON.parse(item);
    } catch (e) {
        return item;
    }
};

export const getObject = (key) => {
    try {
        const item = getItem(key);
        if (
            item !== undefined &&
            item !== null &&
            item !== 'undefined' &&
            item !== 'null'
        ) {
            return JSON.parse(item);
        }
    } catch (e) {
        // noop
    }
    return undefined;
};

export const loadState = () => {
    let state;
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState !== null) {
            state = JSON.parse(serializedState);
        }
    } catch (e) {
        // noop
    }
    return state;
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        // noop
    }
};

export const addItemToKey = (key, value) => {
    const data = getItem(key);
    if (data) {
        data.push(value);
        window.localStorage.setItem(key, JSON.stringify(data));
    } else {
        const items = [];
        items.push(value);
        window.localStorage.setItem(key, JSON.stringify(items));
    }
};

export const removeItem = (key) => {
    window.localStorage.removeItem(key);
};
