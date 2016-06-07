### CRUD

*Create, Remove, Update, Delete*

##### Creating documents

`Collection.insertOne(doc)`

`Collection.insertMany(array)`

##### Ordered v. Unordered inserts

- By default, insertMany() performs an ordered insert. Meaning that, as soon
as it encounters an error, it stops inserting the documents. Returns an object
with property `errmsg` and `op` (operation).
- Alternatively, we can specify `ordered: false` to insertMany, meaning if that
if an error is thrown (eg. attempting to insert two documents with the same `_id` field)
the operation will continue inserting the rest of the documents.


`db.collection.drop()`

- Drops the collection (~= delete all documents and collection itself)

##### Update commands

- Can result in documents being inserted, these are called Upserts.
- More on this later...

#### Read Operations

> The `_id` field

```
          DATE | MAC ADDR | PID | COUNTER
ObjectId: _ _ _| _ _ _ _ _|_ _ _| _ _ _ _
```

- The ObjectId field is a 12-BYTE Hex String

| field          | info           |
| :------------- | :------------- |
| Date           | seconds since Unix epoch       |
| MAC Address    | Machine identifier       |
| PID            | Process ID, server on which Mongo is running      |
| Counter        | Ensure all object IDs, even for duplicates       |

##### Reading Documents

`db.collection.find(<selector>)`
- <selector> is implicitly an `$and` operation by default.

It is possible to match documents against multiple keys in the same field, ie:

> Equality matches in Arrays

`db.movieDetails.find({ "writers" : ["Joel Coen", "Ethan Coen"] }).count()`

However, this method has the disadvantage of being very strict about argument order.
For example, the following document would not match this query (as one might think).

```json
{
  "title": "Big Lebowski",
  "writers" : [
    "Ethan Coen",
    "Joel Coen"
  ]
}
```

Only because the keys are not in the same order as the ones in the document.

It's much more common that you would match a single selector, and then use
`$and` and `$or` operators to specify further constraints.

*if* however we want to specify a specific position of a member within an
array, we can use dot notation to query _just_ that position.

for example:

`db.movieDetails.find({ "actor.0": "Jeff Bridges" })`
`db.movieDetails.find({ "actor.1": "Jeff Bridges" })`

etc.

#### Summary of equality matches

- Scalars (strings)
- Embedded Documents
- Arrays

#### MongoDB Cursor intro

```js
var c = db.movieDetails.find()
var doc = function() { return c.hasNext() ? c.next() : null }

c.objsLeftInBatch()
// 101

c.next() // returns next document
c.next() // returns next document
c.next() // returns next document

c.objsLeftInBatch()
// 98
```

Mongo Docs: [Iterate a cursor](https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/)

#### Projection

- A handy way of reducing the size of data returned by any one query.
- By default, MongoDB returns _all_ data found by any one query.
- *Projections* are supplied by the second argument to the `.find()` command.

```js
db.movieDetails.find({ rated: "PG" }, { title: 1 }).pretty()
```

- This will return *both* the `title` field and the `_id` field.
- If we *don't* want the `_id` field, we must specify `{ _id: 0 }` in the projection.
