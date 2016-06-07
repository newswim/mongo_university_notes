// "Escape from Planet Earth", "Thor: The Dark World", "A Tribute to J.J. Abrams", "Evil Dead", "A Decade of Decadence, Pt. 2: Legacy of Dreams", "Iron Man 3", "Saving Mr. Banks", "World War Z", "Journey to the West", "Man of Steel"

// 2.2
db.getCollection('movieDetails').find({ year: {$eq: 2013}, "awards.wins": {$eq: 0}, title: { $in: ["Escape from Planet Earth", "Thor: The Dark World", "A Tribute to J.J. Abrams", "Evil Dead", "A Decade of Decadence, Pt. 2: Legacy of Dreams", "Iron Man 3", "Saving Mr. Banks", "World War Z", "Journey to the West", "Man of Steel"
]} } ).pretty()

// 2.3
db.getCollection('movieDetails').find({ "countries.1": "Sweden" })

//2.4
db.getCollection('movieDetails').find({ $and: [ { "genres": { $size: 2 }}, {"genres.0": "Comedy"}, {"genres.1": "Crime"} ],  })
