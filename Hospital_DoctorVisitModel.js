var mongoose = require("mongoose") 

var doctorvisitSchema = mongoose.Schema({
    floor_id: {
        type: Number,
        required: [true, "floor_id is mandatory"]
    },
    visiting_time: {
        type: Date,
        required: [true, "visitingTime is mandatory"]
    },
    duration: {
        type: Number,
        required: [false, "duration is mandatory"],
        default:[1]
    },
    datepart: {
        type: Number,
        required : [true, "datepart is mandatory"]
    }
},
{
    timestamps: true
});

const Hospital_DoctorVisitModel = mongoose.model("Hospital_DoctorVisit", doctorvisitSchema);

module.exports = Hospital_DoctorVisitModel;
