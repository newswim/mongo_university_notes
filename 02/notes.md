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

- - - - - - -

- In Mantra and other domains, rather than _projections_ we've called them _selectors_.

#### Comparison Operators

- [Reference Docs](https://docs.mongodb.com/manual/reference/operator/)

> `$gt`, `$gte`, `$lte`

Examples:

```js
db.movieDetails.find({ runtime: { $gt: 90 } }).pretty()
// return all movies with a runtime > 90 minutes
```

```js
db.movieDetails.find({ runtime: { $gte: 90, $lte: 120 }, { title: 1, runtime: 1, _id: 0 } }).pretty()
// return all movies with a runtime >= 90 minutes <= 120 minutes
```

We can of course combine any combination of comparison operators and fields to
ensure fine-grained search results.

```js
db.movieDetails.find({ "tomato.meter": { $gte: 95 }, runtime: { $gt: 180 }, { title: 1, runtime: 1, _id: 0 }}).pretty()
// return all movies with a Tomato Meteor rating greater than 95, Runtime longer than 180 minutes
```

> `$eq`, `$ne`

`$eq` basically works exactly the same as `$gt` and `$lt`

`$ne` however, has a few caveats.

```js
db.movieDetails.find({ rating: { $ne: 'UNRATED' } })
```

`$ne`: in addition to matching documents, it will also return all documents which
_do not contain_ the restricted field at all. This is due to Mongo's flexible data model.
Rather than store a null value, we'll just not store that field at all. So we probably
want to add a restrictive projection on that field we're asking `$ne` to compare.

> `$in`

- Specify a number of values, any one of which will cause a document to be returned.

```js
db.movieDetails.find({ rated: { $in: [ "G", "PG", "PG-13" ] } }).pretty()
// all movies which are rated any one of these three values
```

> `$nin`

- [`$nin` docs](https://docs.mongodb.com/manual/reference/operator/query/nin/#op._S_nin)

`$nin` selects the documents where:

- the field value is not in the specified array or
- the field does not exist.


#### Element Operators (`$exists` and `$type`)

> `$exists`

- Match documents to a field that either exists or doesn't exist

```js
db.movieDetails.find({ "tomato.meteor": { $exists: true } })
```

> `$type`

- Match a field to a given _type_

```js
db.movieDetails.find({ "_id": { $type: "string" } })
// return movies where we've used our own field (imdb url for instance) as the _id
```

#### Logical Operators (`$or` and `$and`)

```js
db.movieDetails.find({ $or: [ { "tomator.meteor": { $gt: 95 } }, { "metacritic": { $gt: 88 } } ] })
```

- `$and` is only necessary in certain situations . .

```js
db.movieDetails
```

- the `$and` operator might be superfluous, since .find() queries are _implicitly_
'and'd' together.
- it does allow us to specify multiple constraints on the same field. Example:

```js
db.movieDetails.find({ $and : [ { "metacritic": { $ne: null } },
                                { "metacritic": { $exists: true } } ] })
```

- can be useful within DBs where we know the data isn't very clean.


#### Regex Operator

> Yikes.

It's good that it's there, but why not go through [RegexOne](http://regexone.com/) first...

But anyway, here's an example:

```js
db.movieDetails.find({ "awards.text": { $regex: /^Won.*/ } })
// Start at the begining of whatever value we're matching against, and then any
// character, any number of times.
```

#### Array Operators (`$all`, `$elemMatch`, `$size`)

> `$all`

- Return all documents where _all_ fields are true

```js
db.movieDetails.find({ genres: { $all: ["Comedy", "Crime", "Drama"] } })
```

> `$size`

- Match documents based on length of array

```js
db.movieDetails.find({ countries: { $size: 1 } })
```

> `$elemMatch`

Because of MongoDB query language, some documents with nested documents may return
results that we mightn't expect. Take the following:

```js
boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.5 },
             { "country": "France", "revenue": 3.5 } ]

// a query like this would return this document, even though we might not
// expect or want it to.
db.movieDetails.find({ boxOffice: { country: "UK", revenue: { $gt: 15 } } })
```

This is because Mongo is checking that the document has subdoc with "UK" in one
of the "country" fields, and _one or any_ of the "revenue" subfields is greater than 15.

We're matching `boxOffice` as a whole.

This is where we need to use `$elemMatch`, for example:

```js
db.movieDetails.find({ boxOffice: {$elemMatch: { country: "UK", revenue: { $gt: 15 } } } })
```

- `$elemMatch` requires that each of the elements in the array matches the specified fields.
