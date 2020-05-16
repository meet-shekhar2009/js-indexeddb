module.exports.jsIndexedDB = (async function (config) {
    let DB, index, request, store;
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!config || typeof config != "object")
        throw Error("Pass a valid cofiguration");

    if (!config.hasOwnProperty("dbName") || !config.hasOwnProperty("storeConfig")) {
        throw Error("dbName and storeConfig are required properties in configuration object");
    }
    if (!Array.isArray(config.storeConfig))
        throw Error("storeConfig must be of type array");

    const _createStore = (element, DB) => {
        if (!element.hasOwnProperty("name"))
            throw Error("all the elements of storeConfig must have name property");
        let autoIncrement = element.hasOwnProperty("autoIncrement") ? element.autoIncrement : false;
        let keyPath = element.hasOwnProperty("keyPath") ? element.keyPath : null;
        let objectStore = null;
        if (keyPath)
            objectStore = {
                keyPath,
                autoIncrement
            };
        else
            objectStore = {
                autoIncrement
            };
        if (DB.objectStoreNames && ![...DB.objectStoreNames].some(k => k === element.name))
            store = DB.createObjectStore(element.name, objectStore);
    }
    const _createIndexes = (input) => {
        if (input.hasOwnProperty("indexes") && Array.isArray(input.indexes)) {
            input.indexes.forEach(element => {
                if (element.hasOwnProperty("fields") && Array.isArray(element.fields) && element.fields.length > 0) {
                    let unique = element.hasOwnProperty("isUnique") ? element.isUnique : false;
                    let indexName = element.fields.join(",").toLowerCase();
                    if (store)
                        store.createIndex(indexName, element.fields, {
                            unique
                        });
                }
            });
        }
    }
    const createDatabase = async () => {

        return new Promise((resolve, reject) => {
            if (indexedDB) {
                const version = config.version || 1;
                request = indexedDB.open(config.dbName, version);
            }
            request.onupgradeneeded = e => {
                DB = request.result;

                config.storeConfig.forEach(element => {
                    //creating store
                    _createStore(element, DB);

                    // creating indexes on store
                    _createIndexes(element);

                });
            }
            request.onsuccess = e => {
                DB = request.result;
                resolve();
            }

            request.onerror = e => {
                reject(e);
            }
        });

    }


    const getuserSchema = (schemaName) => {
        return new Promise((resolve, reject) => {
            let TX = DB.transaction(schemaName, "readwrite");
            let store = TX.objectStore(schemaName)

            resolve(store);
            DB.onerror = e => reject(e);
            TX.oncomplete = k => {
                //setTimeout(()=>{DB.close();},100) 
                //console.log("db is closed");
            }
        })
    }
    const _add = async (schemaName, data) => {
        let store = await getuserSchema(schemaName);
        store.add(data)

    }
    const _update = async (schemaName, data) => {
        let store = await getuserSchema(schemaName);
        store.put(data)

    }
    const _delete = async (schemaName, key) => {
        let store = await getuserSchema(schemaName);
        store.delete(key)

    }
    const getKeysAndvalues = (input) => {
        let keys = Object.keys(input);
        let values = [];
        if (keys) {
            for (let key of keys) {
                values.push(input[key]);
            }
        }
        return {
            keys: keys.join(",").toLowerCase(),
            values
        }
    }
    const _get = async (schemaName, input) => {

        let store = await getuserSchema(schemaName);
        let response = null;

        if (typeof input === "object") {
            let {
                keys,
                values
            } = getKeysAndvalues(input);
            response = store.index(keys).get(values);

        } else
            response = store.get(input);
        let promise = new Promise((resolve, reject) => {
            response.onsuccess = () => {
                resolve(response.result);
            }
        });
        return promise;
    }
    const _getall = async (schemaName, input = undefined) => {
        let store = await getuserSchema(schemaName);
        let response = null;

        if (typeof input === "object") {
            let {
                keys,
                values
            } = getKeysAndvalues(input);
            response = store.index(keys).getAll(values);

        } else
            response = store.getAll();
        let promise = new Promise((resolve, reject) => {
            response.onsuccess = () => {
                resolve(response.result);
            }
        });
        return promise;
    }
    // Init
    await createDatabase();
    return {
        add: _add,
        update: _update,
        get: _get,
        getAll: _getall,
        delete: _delete

    }
});