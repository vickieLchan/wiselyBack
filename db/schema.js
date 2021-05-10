export default async (db) => {
  return Promise.all([
    db.createCollection("restaurants", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "address"],
          properties: {
            name: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            address: {
              bsonType: "object",
              required: ["city"],
              properties: {
                city: {
                  bsonType: "string",
                  description: "must be a string and is required"
                }
              }
            }
          }
        }
      }
    }),
    db.createCollection("inventory", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["date", "availability", "reserved", "is_default", "restaurant_id"],
          properties: {
            date: {
              bsonType: "date",
              description: "date of the available inventory, required"
            },
            restaurant_id: {
              bsonType: "objectId",
              description: "the id of the restaurant, required"
            },
            availability: {
              bsonType: "array",
              description: "the maximum inventory for all buckets",
              minItems: 96,
              maxItems: 96,
              items: {
                bsonType: "int",
                description: "the number of reservations available",
              }
            },
            reserved: {
              bsonType: "array",
              description: "current reservations",
              minItems: 96,
              maxItems: 96,
              items: {
                bsonType: "array",
                description: "an array of the reservation ids",
                items: {
                  bsonType: "objectId",
                  description: "reservation id"
                }
              }
            },
            is_default: {
              bsonType: "bool",
              description: "the default inventory for a given day"
            }
          }
        }
      }
    }),
    db.createCollection("reservations", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "party_size", "email", "date", "restaurant_id"],
          properties: {
            restaurant_id: {
              bsonType: "objectId",
              description: "the id of the restaurant, required"
            },
            name: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            party_size: {
              bsonType: "int",
              minimum: 1,
              maximum: 50,
              description: "must be an integer in [ 1, 50 ] and is required"
            },
            email: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            date: {
              bsonType: "date",
              description: "date and time of the reservation"
            }
          }
        }
      }
    })
  ])
}