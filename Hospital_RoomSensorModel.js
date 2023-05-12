
var mongoose = require("mongoose") 

var roomsensorSchema = mongoose.Schema({
    room_number:{
        type: Number,
        required: [true, "room_id is mandatory"],
        unique: [false, "room_id is Unique"]
    },
    sensor_code: {
        type: String,
        required: [true, "sensor_code is mandatory"]
    },
    floor_id: {
        type: Number,
        required: [true, "floor_id is mandatory"]
    },
},
{
    timestamps: true
});

const Hospital_RoomSensorModel = mongoose.model("Hospital_RoomSensor", roomsensorSchema);

module.exports = Hospital_RoomSensorModel;