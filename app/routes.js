var User = require('./models/User');
var Lastfm = require('./models/Lastfm');

// user auth middleware
var authenticated = function(req, res, next) {
    if (req.session) return next();
}

var anonymous = function(req, res, next) {
    if (!req.session) {
        res.redirect('/logout')
    }
    return next();
}

var comparePasswords = function(pass1, pass2, cb) {
    return cb({result: pass1 == pass2, value: pass1});
}

// routes
module.exports = function(app) {

    app.use(function(req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user;
            console.log(`${res.locals.user.username} authenticated`)
        }
        return next();
    });
    
    app.get('/', (req, res, next) => {
        if (req.session.user) {
            // user logged in
            User.findOne({_id: req.session.user}, (err, user) => {
                if (err) next(err);
    
                res.render('index', {user: user});
            });
        } else {
            // bring to splash
            res.render('splash');
        }
    });

    app.get('/about', (req, res) => {
        res.render('about');
    });

    app.get('/settings', authenticated, (req, res, next) => {
        User.findOne({_id: req.session.user}, (err, user) => {
            if (err) next(err);

            res.render('settings', {user: user});
        });
    });

    app.post('/settings', authenticated, (req, res, next) => {
        console.log('editing user');

        if (req.body.password && req.body.password2) {
            comparePasswords(req.body.password, req.body.password2, (pass) => {
                if (pass.result) {
                    User.findOne({_id: req.session.user}, (err, user) => {
                        user.password = pass.value;
                        user.save((err) => {
                            if (err) next(err)
                            console.log(`${user.username} updated password`)
                        })
                    })
                } else {
                    // passwords are different
                }
            })
        }

        User.findOne({_id: req.session.user}, (err, user) => {
            if (req.body.bio) user.bio = req.body.bio;

            user.save((err) => {
                if (err) next(err);

                console.log(`${user.username} updated bio`);
                res.redirect('/settings');
            });
        });
    });
    
    app.get('/@:username', (req, res) => {
        if (!req.params.username) res.redirect('/');
    
        // determine whose account and render
        User.findOne({username: req.params.username}, (err, user) => {
            if (!user || err) return res.redirect('/404');

            res.render('user', {user: user});
        });
    });
    
    app.get('/login', anonymous, (req, res) => {
        res.render('login');
    });
    
    app.get('/signup', anonymous, (req, res) => {
        res.render('signup');
    });
    
    app.post('/signup', anonymous, (req, res, next) => {
        if (req.body.username && req.body.password) {
            var u = new User({
                username: req.body.username,
                password: req.body.password
            });
            u.save((err, user) => {
                if (err) return next(err);

                req.session.user = user;
                res.redirect('/');
            })
        } else {
            res.json({
                title: 'credentials',
                message: 'username or password required'
            });
        }
    });
    
    app.post('/login', anonymous, (req, res, next) => {
        User.findOne({username: req.body.username}, (err, user) => {
            if (err || !user) next(err);

            console.log('trying to log in');

            if (user.compare(req.body.password)) {
                req.session.user = user;
    
                return res.redirect('/');
            } else {
                err = 'incorrect password';
                return next(err);
            }
        });
    });

    app.get('/deactivate', authenticated, (req, res) => {
        res.render('deactivate');
    });

    app.post('/deactivate', authenticated, (req, res, next) => {
        User.findOneAndDelete({_id: req.session.user}, (err) =>{
            if (err) next(err);

            req.session.destroy((err) => {
                if (err) next(err);
                return res.redirect('/');
            });
        });
    });

    app.get('/callback', (req, res) => {
        res.send('yo callback!');
    });

    app.get('/logout', authenticated, (req, res, next) => {
        req.session.destroy((err) => {
            if (err) next(err);

            res.redirect('/');
        });
    });

    app.get('/social', (req, res) => {
        var user = Lastfm();
        user.getArtists('jshtrmml');

        console.log(Lastfm.getArtists('jshtrmml'));
        res.render('social');
    });

    // dev
    app.get('/users.json', (req, res) => {
        User.find({}, (err, users) => {
            res.send(users);
        });
    });

    app.get('/session.json', authenticated, (req, res) => {
        res.send(req.session);
    });

    app.get(['/404', '*'], (req, res) => {
        res.status(404);
        res.render('404');
    });

    // error handling
    app.use(function(err, req, res, next) {
        res.status(500);
        res.render('error', {message: err});
    });
}