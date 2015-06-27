var mongoose = require('mongoose');
var baucis = require('baucis');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
var userSchema = new mongoose.Schema({
  username: {type:String, required:true},
  password: {type:String, required:true},
})

userSchema.pre('save', function(next){
  bcrypt.hash(this.password, 8, function(err, hash) {
    this.password = hash;
    next();
  }.bind(this));
});

userSchema.methods.validPassword = function(password, next){
  return bcrypt.compareAsync(this.password, password, function(err, res) {
    if(err) throw new Error("Incorrect password");
    return res;
  });
}

module.exports = mongoose.model('user', userSchema);