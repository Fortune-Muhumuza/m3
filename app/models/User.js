const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , bcrypt = require('bcrypt')
    , saltRounds = 10;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    created_at: Date,

    lastfm: {
        username: { type: String }
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.compare = function(pw) {
    return bcrypt.compareSync(pw, this.password);
}

module.exports = mongoose.model('User', userSchema);