# js-indexedDB Guide

js-indexedDB is a npm package / javascript library to perform javascript indexeddb actions using async/await. Library is simple to use with vanilla javascript and any javascript frameworks like Angualr .

# Installation

```javascript

npm i js-indexedb --save

```
# Table of Content 

1. [ Configurations. ](#a_configuration)
2. [ Configuration details. ](#a_configuration_desc)
3. [ Database initialization. ](#a_dbinit)
4. [ Methods. ](#a_methods)
5. [ Usage Complete Code. ](#a_completecode)
6. [ How to use with Angular. ](#a_angular)

# Usage

## vanilla javascript and Angular

<a name="a_configuration"></a>
### Initial Configuration

```javascript
const cofiguration = {
        dbName: 'Customers', // Database Name.
        version: 1, // Every time we change any schema change we have to increment version number.
        storeConfig: [{ // This felds contains db schema/tables/collections. 
                name: "UserDetails", //Name of schema.
                keyPath: "UserID", // Primary key.
                autoIncrement: true, // If don't want to write unique primary value set this falag true,
                // it will take incremantal numbers as primary key
                indexes: [{ // These fields are used for creating different sets of index on schema to make search.
                        fields: ["Country", "City"], // column names on which indexes will create
                        isUnique: false // if true duplicate values will be removed form index
                    },
                    {
                        fields: ["Type"],
                        isUnique: false
                    }
                ]

            },
            {
                name: "Orders",
                keyPath: "ID",
                autoIncrement: true
            }
        ]
    };

```

<a name="a_configuration_desc"></a>
### Configuration description 

| Property | Is Mandatory | Default | Description |
| --- | --- | --- | --- |
| dbName | YES | NA | Actual Database Name. |
| version | NO | 1 | Every time we change any schema change we have to increment version | 
| storeConfig | YES | NA | This felds contains db schema/tables/collections. |
| name | YES | NA | Name of schema. |
| autoIncrement | YES | NA | If don't want to write unique primary value set this falag true, it will take incremantal numbers as primary key |
| indexes | NO | no index | These fields are used for creating different sets of index on schema to make search. |
| fields | YES | NA | column names on which indexes will create |
| isUnique | NO | false | if true duplicate values will be removed form index |


### Create and initialize database  objects as per configuration
<a name="a_dbinit"></a>
``` javascript

    const db = await jsIndexedDB(cofiguration);
```
### Add data

```javascript
   const user_1 = {
        UserID: "UID0001",
        Name: "James Williams",
        Country: "USA",
        City: "New York",
        Email: "James_UID0001@hotmail.com",
        Type: "Premium"
    };
    const user_2 = {
        UserID: "UID0002",
        Name: "John Smith",
        Country: "USA",
        City: "California",
        Email: "James_UID0002@gmail.com",
        Type: "Premium"
    };
    try {
        //add first user
        await db.add("UserDetails", user_1);

        //add second user
        await db.add("UserDetails", user_2);
    } catch (error) {
        console.log(error);
    }
    
    <a name="a_methods"></a>
```
### Get data

```javascript
    //Get data 
    let result = await db.get("UserDetails", "UID0001");
    if (result)
        console.log(JSON.stringify(result));
```        

### Get data using promise

```javascript
//get data using promise
    let promise = db.get("UserDetails", "UID0001");
    promise.then((result) => {
            console.log(JSON.stringify(result));
        },
        (err) => {
            console.error(err)
        });
```

### Get Data By Index

```javascript
    let result = await db.get("UserDetails", {
        Country: "USA",
        City: "New York",
    });
    if (result)
        console.log(JSON.stringify(result));
```

### Get All data

``` javascript
    let result = await db.getAll("UserDetails");
    if (result && result.length > 0)
        console.log(JSON.stringify(result));
```

### Get All Data By Index

```javascript

    let result = await db.getAll("UserDetails", {
        Country: "USA",
        City: "New York",
    });
    if (result && result.length > 0)
        console.log(JSON.stringify(result));
```

### update data

```javascript
    let result = await db.update("UserDetails", {
        UserID: "UID0001",
        Email: "James_UID0001@gmail.com"
    });
```

### delete data

```javascript 

    let result = await db.delete("UserDetails", "UID0001");
```    
<a name="a_completecode"></a>
### Complete code

```javascript
(async function () {
    const cofiguration = {
        dbName: 'Customers', // Database Name.
        version: 1, // Every time we change any schema change we have to increment version number.
        storeConfig: [{ // This felds contains db schema/tables/collections. 
                name: "UserDetails", //Name of schema.
                keyPath: "UserID", // Primary key.
                autoIncrement: true, // If don't want to write unique primary value set this falag true,
                // it will take incremantal numbers as primary key
                indexes: [{ // These fields are used for creating different sets of index on schema to make search.
                        fields: ["Country", "City"], // column names on which indexes will create
                        isUnique: false // if true duplicate values will be removed form index
                    },
                    {
                        fields: ["Type"],
                        isUnique: false
                    }
                ]

            },
            {
                name: "Orders",
                keyPath: "ID",
                autoIncrement: true
            }
        ]
    };

    try {

        let result = null;
        // Create database and its objects as per configuration
        const db = await jsIndexedDB(cofiguration);


        // Add data in schema/table
        const user_1 = {
            UserID: "UID0001",
            Name: "James Williams",
            Country: "USA",
            City: "New York",
            Email: "James_UID0001@hotmail.com",
            Type: "Premium"
        };
        const user_2 = {
            UserID: "UID0002",
            Name: "John Smith",
            Country: "USA",
            City: "California",
            Email: "James_UID0002@gmail.com",
            Type: "Premium"
        };

        result = await db.add("UserDetails", user_1);
        if (result)
            console.log("succes!");
        result = null;

        result = await db.add("UserDetails", user_2);
        if (result)
            console.log("succes!");
        result = null;

        //Get data 
        result = await db.get("UserDetails", "UID0001");
        if (result)
            console.log(JSON.stringify(result));
        result = null;

        //get data using promise
        let promise = db.get("UserDetails", "UID0001");
        promise.then((result) => {
                console.log(JSON.stringify(result));
            },
            (err) => {
                console.error(err)
            });
        result = null;
        //Get Data By Index
        result = await db.get("UserDetails", {
            Country: "USA",
            City: "New York",
        });
        if (result)
            console.log(JSON.stringify(result));
        result = null;

        //Get All data
        result = await db.getAll("UserDetails");
        if (result && result.length > 0)
            console.log(JSON.stringify(result));
        result = null;

        //Get All Data By Index
        result = await db.getAll("UserDetails", {
            Country: "USA",
            City: "New York",
        });
        if (result && result.length > 0)
            console.log(JSON.stringify(result));
        result = null;

        //update data
        result = await db.update("UserDetails", {
            UserID: "UID0001",
            Email: "James_UID0001@gmail.com"
        });
        result = null;

        //delete data 
        result = await db.delete("UserDetails", "UID0001");
    } catch (error) {
        console.log(error);

    }
})()

```
<a name="a_angular"></a>
# how to use library with Angular

- Step 1 : install jsIndexeddb npm package
- Step 2 : add script in angular.json or (for verison <= 5 .angular-cli.json)

```javascript
"scripts":["node_modules/js-indexedb/dist/js-IndexedDB.js"]
```

- step 3 : 
```javascript
declare const jsIndexedDB: any;
```
- step 4 :
```javascript
 async ngOnInit() {
     const configuration ={.....}
    let db = await jsIndexedDB(configuration);
        let result = await db.get("UserDetails", "UID0001");
      if (result)
       this.User = result;
  }
```