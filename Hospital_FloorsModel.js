var mongoose = require("mongoose") 

var floorsSchema = mongoose.Schema({
    floor_id:{
        type: Number,
        required: [true, "floor_id is mandatory"],
        unique: [true, "floor_id is Unique"]
    },
    number_of_rooms: {
        type: Number,
        required: [true, "number_of_room is mandatory"]
    },

},
{
    timestamps: true
});

const Hospital_FloorsModel = mongoose.model("Hospital_Floors", floorsSchema);

module.exports = Hospital_FloorsModel;