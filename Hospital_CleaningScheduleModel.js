var mongoose = require("mongoose") 

var scheduleSchema = mongoose.Schema({
    floor_id: {
        type: Number,
        required: [true, "floor_id is mandatory"]
    },
    room_number: {
        type: Number,
        required: [true, "room_number is mandatory"]
    },
    schedule_starttime: {
        type: Date,
        required: [true, "cleaning_start_time is mandatory"]
    },
    schedule_endtime: {
        type: Date,
        required: [true, "cleaning_end_time is mandatory"]
    },
    datepart:{
        type: Number,
        required: [true, "datepart is mandatory"]
    },
    cleaned_status: {
        type: Boolean,
        required: [false, "cleaned_status is mandatory"],
        default: false
    }
},
{
    timestamps: true
});

const Hospital_CleaningScheduleModel = mongoose.model("Hospital_CleaningSchedule", scheduleSchema);

module.exports = Hospital_CleaningScheduleModel;


