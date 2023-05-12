
var mongoose = require("mongoose") 
var roomsSchema = mongoose.Schema({
  
    floor_id: {
        type: Number,
        required: [true, "floor_id is mandatory"]
    },
    room_number: {
        type: Number,
        required: [true, "number_of_room is mandatory"]
    },
    room_type: {
        type: String,
        required: [false, "number_of_room is mandatory"]
    },

},
{
    timestamps: true
});

const Hospital_RoomsModel = mongoose.model("Hospital_Rooms", roomsSchema);

module.exports = Hospital_RoomsModel;