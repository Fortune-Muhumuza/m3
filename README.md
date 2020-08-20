m3
=====

trying to make a social media similar to the one I created in [that video](https://www.youtube.com/watch?v=m0tYor9IJPA). however this one will be music orientated with a goal of sharing songs & lyrics.

about
-----

still figuring this out but the idea of it is to share and quote music captions, highlighted similarly to that of [genius](http://genius.com). 

working on this with my friend so we'll get more inspiration as we bounce ideas back and forth off each other.

testing
-------

some requirements. mongodb must be installed either from 
[their website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) or using [brew.sh](https://brew.sh)

e.g.
```bash
$ brew tap mongodb/brew
$ brew install mongodb-community@4.2
```

after that's all installed you'll have to create a local database

```bash
$ sudo mkdir /data/db
$ sudo chmod -R go+w /data/db
```

you're all set! note: the following commands will need to be run in seperate terminal windows.

```bash
$ mongod # open database
$ node index.js # start server
```

browse `localhost:8080` and you're good to go.


notes
-----

I've also made a few additional notes/comments in the code, messed with CSS
a bit and cleaned up some deprecations. I've also shortened some variables for cleanliness so be sure to match them if you're getting errors.

Feel free to fork this and keep it updated! the more awareness this gets the more inclined I am to share


to-do
-----

- [x] secure login/register with mongo
- [x] integrate responsive ss framework
- [ ] connect lastfm + spotify/apple api
- [ ] post content (songs, lyrics)
- [ ] user page (design + settings)
- [ ] error handling / flash messages
- [ ] test suite (jest/supertest)


[LICENSE](LICENSE).
