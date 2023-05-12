const mongoose = require("mongoose");
const Hospital_DoctorVisitModel = require("./models/Hospital_DoctorVisitModel");
const Hospital_FloorsModel = require("./models/Hospital_FloorsModel");
const connection = "mongodb+srv://Fidgeting:0J5XSU55nH56Mijw@testcluster.vnwjzfa.mongodb.net/Preethi1?retryWrites=true&w=majority";

//Make Mongo DB connection
mongoose.connect(connection)
    .then(()=>console.log("successfully connected DB"))
    .catch(err => console.log(err));

var NoofDays = 4;

const GenerateDoctorVisitingSchedule = async() =>{
    try{        
        console.log("Start generating Doctor Visiting Schedule");

        var resultfloordetails = await Hospital_FloorsModel.find();

        if(resultfloordetails)
        {

            for(var i = 0; i < NoofDays; i++)
            {
                var insertDate = new Date();
                var setDateForFloorVisit = new Date(insertDate.setDate(insertDate.getDate() + i));
                var datepart = setDateForFloorVisit.getDate();
                //Validation whether current date has any visiting schedule or not
                var resultDocVisitRecord = await Hospital_DoctorVisitModel.find({datepart:{$eq:datepart}});
                //console.log("datepart:: " + datepart);
                if(resultDocVisitRecord.length == 0)
                {
                    for(var t=0; t<resultfloordetails.length; t++)
                    {
                        var starthour = rnd(9, 16);
                        setDateForFloorVisit = new Date(setDateForFloorVisit.setHours(starthour));
                        const visitingSchema = new Hospital_DoctorVisitModel({
                            floor_id: resultfloordetails[t].floor_id,
                            visiting_time: setDateForFloorVisit,
                            duration: rnd(1, 4),
                            datepart: setDateForFloorVisit.getDate()
                        });
                        const saveVisiting = await visitingSchema.save();
                    }
                    //console.log("Already Not Available");
                }
                // else
                // {
                //     console.log("Already Available");
                // }
                //console.log(setDateForFloorVisit);
            }
        }
        console.log("-- Finished --")
        process.exit(1);
    }catch(err){console.log(err);}
};

function rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

GenerateDoctorVisitingSchedule();