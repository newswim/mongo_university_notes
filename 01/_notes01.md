##### What is MongoDB?

MongoDB is a Document database that stores JSON documents in side of collections. It supports a variety of operators, query methods, sort operations, etc.

Some key features:
- Horizontal scaling
- Efficiently supports _common_ data access patterns
- Agile software engineering practices

#### An application from 20,000 feet

App < - - - > Client * x

App: Node.js: *A C++ program that is controlled w/ V8 JavaScript*

MongoDB
- C++
- Responds to read/write requests from server

Mongo Shell
- Administrative tool
- Similar to Node, just a C++ program controlled via V8
- Fully functional JavaScript interpreter

#### JSON Review

- Objects are opened and closed with curly braces
- Keys and Values are separated by a colon
- Fields are separated by a comma

> JSON supports a number of different value types:
- String
- Number
- Boolean
- Array
- Object

There are several different types of nesting. For instance, arrays can be composed of any combination of legal values. Likewise, objects can be highly hierarchical and contain any number of child objects that represent deeply nested values.

#### BSON Review

[Spec](http://bsonspec.org)

Binary JSON
- Lightweight
- Traversable
- Efficient

MongoDB drivers send and receive data as BSON. And, when data is _stored_ in mongo, it's stored as BSON.

Drivers need to encode and decode BSON very quickly.

Like JSON, there's a only a single `Number` type. Also, there's no Date type, so it has to be encoded as a string or some type of nested object.

However, BSON extends the basic types provided by JSON to better handle storage of encoded data. Some of the basic types include:

```
- byte      | 1 byte (8-bits)
- int32     | 4 bytes (32-bit signed integer, two's complement)
- int64     | 8 bytes (64-bit signed integer, two's complement)
- double    | 8 bytes (64-bit IEEE 754-2008 binary floating point)
```

While we're working with data within Mongo, we'll tend to use the word 'Document' - this is because what we're referencing isn't strictly speaking JSON, but an extended form used by Mongo that supports additional types.

#### CRUD Operations

Create, Remove, Update, Delete

##### The MongoDB Query Language

`.find()`

- happens asynchronously, we're not waiting for a return value, but instead
firing off a thread that will handle the request and pick up execution within
the callback once the request finishes.
- however that thread is blocked until the `find()` command returns.


#### The MongoDB Driver

Include the driver and use in your node app just as you would any other library.

In order to use the 'mongodb' module, it's important to understand how
asynchronous I/O is done in Node applications.

#### More about Express.js

##### Handling GET Requests

- URL Parameters
- GET Variables


##### Handling POST Requests

- We'll use bodyParser middleware
- We'll also create an errorHandler function, which let's use pass errors
within a callback like so:
```js
...
next(Error('my error message'))
...
```
