const mongoose = require('mongoose');

const name = 'Edik';
const age = 1;
const bool = true | false;
const und = undefined;
const nl = null;
const obj = {};
const arr = ['dsadas',222,true,{ddd:'dsds'}]

const EventSchema = new mongoose.Schema({
  topic: String,
  creator: String,
  isActive: {
    type: Boolean,
    default: false,
},
members:{
  nickName:String
},
paid:{
type:Boolean,
default:false
}
});

module.exports = mongoose.model('Event', EventSchema);
