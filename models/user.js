var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var config = require('../config').config;

var UserSchema = new Schema({
  name: { type: String, index: true },
  password: { type: String },
  email: { type: String, unique: true },
  avatar: { type: String },
  docs:[{ type: Schema.Types.ObjectId, ref: 'Doc' }]
});

UserSchema.virtual('avatar_url').get(function () {
  //var url = this.profile_image_url || this.avatar || config.site_static_host + '/public/images/user_icon&48.png';
  //return url.replace('http://www.gravatar.com/', 'http://gravatar.qiniudn.com/');
});

mongoose.model('User', UserSchema);
