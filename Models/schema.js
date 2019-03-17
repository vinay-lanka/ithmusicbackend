let mongoose = require('mongoose')
let songSchema = new mongoose.Schema({
  songName: String,
  artistName: String
})
module.exports = mongoose.model('Song', songSchema)
