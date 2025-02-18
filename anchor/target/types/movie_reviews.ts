/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/movie_reviews.json`.
 */
export type MovieReviews = {
  "address": "BAogysdq9WGznDqMf3EmXjM8QdR5gWEVK5WJhEXgPB7S",
  "metadata": {
    "name": "movieReviews",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addMovieReview",
      "discriminator": [
        82,
        218,
        40,
        213,
        242,
        141,
        142,
        57
      ],
      "accounts": [
        {
          "name": "movieReview",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "initializer"
              }
            ]
          }
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deleteMovieReview",
      "discriminator": [
        145,
        87,
        218,
        149,
        170,
        123,
        217,
        101
      ],
      "accounts": [
        {
          "name": "movieReview",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "initializer"
              }
            ]
          }
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateMovieReview",
      "discriminator": [
        249,
        116,
        24,
        72,
        122,
        80,
        243,
        89
      ],
      "accounts": [
        {
          "name": "movieReview",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "initializer"
              }
            ]
          }
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "movieAccountState",
      "discriminator": [
        103,
        146,
        32,
        212,
        187,
        166,
        40,
        13
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidRating",
      "msg": "Rating must be between 1 and 5"
    },
    {
      "code": 6001,
      "name": "titleTooLong",
      "msg": "Movie Title too long"
    },
    {
      "code": 6002,
      "name": "descriptionTooLong",
      "msg": "Movie Description too long"
    }
  ],
  "types": [
    {
      "name": "movieAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reviewer",
            "type": "pubkey"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    }
  ]
};
