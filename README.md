Matt's timestamp microservice
=============================

How to use
----------

Pass a string as a paramater to `https://matts-unix-timestamp.glitch.me/` to request time in unix or natural language.

The time you pass can be unix **or** natural language and you will be returned both unix and nautral language.

Example usage
-------------

`https://matts-unix-timestamp.glitch.me/December%2015,%202015`
`https://matts-unix-timestamp.glitch.me/1450137600`

Example output
--------------

`{ "unix": 1450137600, "natural": "December 15, 2015" }`