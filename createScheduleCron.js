
const mongoose = require("mongoose");
const schedule = require ("node-schedule");

const connection = "mongodb+srv://Fidgeting:0J5XSU55nH56Mijw@testcluster.vnwjzfa.mongodb.net/Preethi1?retryWrites=true&w=majority";
const Hospital_CleaningScheduleModel = require("./models/Hospital_CleaningScheduleModel");
const Hospital_DoctorVisitModel = require("./models/Hospital_DoctorVisitModel");
const Hospital_RoomsModel = require("./models/Hospital_RoomsModel");

//Make Mongo DB connection
mongoose.connect(connection)
    .then(()=>console.log("successfully connected DB"))
    .catch(err => console.log(err));

schedule.scheduleJob('*/45 * * * * *' ,() => {

var resultDocVisit;
var resultRooms;
//Fetch the Doctor visiting records (> current day)
const findDoctorVisitingTime = async()=>{
    try{
        //Get Doctor Visiting Records
        const countSchedule = await Hospital_CleaningScheduleModel.find();
        if (countSchedule.length == 0)
        {
            resultDocVisit = await Hospital_DoctorVisitModel.find({datepart: {$gte: new Date().getDate()}});
        }
        else{
            resultDocVisit = await Hospital_DoctorVisitModel.find({datepart: {$gt: new Date().getDate()}});
        }

        //console.log(resultDocVisit);
        //console.log("Doctor Visiting Count - " + resultDocVisit.length);

        //Checking whether doctor visiting records available or not
        if(resultDocVisit){
            var currentdatepart = new Date().getDate();
            //Delete existing cleaning schedule for > current day
            const deleteSchedule = await Hospital_CleaningScheduleModel
                .deleteMany({datepart: {$gt: currentdatepart}});
            //console.log("Delete count : - " + deleteSchedule.length);
            if(deleteSchedule)
                console.log("Deleted Existing Schedule");

            //Looping to get Rooms for floor-wise
            for(var k = 0; k < resultDocVisit.length; k++)
            {
                resultRooms = await Hospital_RoomsModel.find({floor_id:resultDocVisit[k].floor_id});
                //console.log("Rooms Count - " + resultRooms.length);

                //Checking wheteher rooms are available or not
                if(resultRooms)
                {
                    //console.log("Visiting Time: " + resultDocVisit[k].visiting_time + ",,, floor_id : " + resultDocVisit[k].floor_id);
                    //Looping the available rooms to make schedule
                    for(var h = 0; h < resultRooms.length; h++)
                    {
                        var doctorVisitingTime = new Date(resultDocVisit[k].visiting_time);
                        var doctorVisitStarttime = doctorVisitingTime.getHours();
                        var doctorVisitDuration = resultDocVisit[k].duration;
                        //console.log("doctorVisitingTime-- " + doctorVisitingTime);
                        //console.log("doctorVisitingTimeHour-- " + doctorVisitStarttime)
                        var scheduleStartTime;
                        if (doctorVisitStarttime <= 12){
                            scheduleStartTime = doctorVisitStarttime + doctorVisitDuration + 3;
                        }else{
                            scheduleStartTime = doctorVisitStarttime - 6;
                        }
                        //console.log("Schedule Start Hour --- " + scheduleStartTime);
                        // const doctorVisitStarttime11 = (resultDocVisit[k].visiting_time.getUTCDate() 
                        //     + "-" + resultDocVisit[k].visiting_time.getUTCMonth()
                        //     + "-" + resultDocVisit[k].visiting_time.getUTCFullYear());

                        //Inserting schedule records
                        const scheduleSchema = new Hospital_CleaningScheduleModel({
                            floor_id: resultRooms[h].floor_id,
                            room_number: resultRooms[h].room_number,
                            schedule_starttime: doctorVisitingTime.setHours(scheduleStartTime),
                            schedule_endtime: doctorVisitingTime.setHours(scheduleStartTime + 1),
                            datepart: doctorVisitingTime.getDate()
                        });
                        // console.log("floor_id  --  " + resultRooms[h].floor_id)
                        // console.log("VisitingTime:::  --  " + doctorVisitingTime);
                        //console.log("final schedule start time  --  " + new Date(doctorVisitingTime.setHours(scheduleStartTime)));
                        // console.log("schedule end time  --  " + new Date(doctorVisitingTime.setHours(scheduleStartTime + 1)));
                        
                        const saveSchedule = await scheduleSchema.save();

                        

                        //console.log("Visiting Time: " + resultDocVisit[k].visiting_time + ",,, floor_id : " + resultDocVisit[k].floor_id);
                        //console.log("Visiting Time floor id: " + resultDocVisit[k].floor_id);
                        //console.log("Room & Floor ID: " + resultRooms[h].room_number + " & " + resultRooms[h].floor_id);
                    }
                }
                //console.log("**************************");
            }
        }

        console.log("***** Finished ******");
        //process.exit(1); // Need to remove this line
    }catch(err){console.log(err);}
};

//Main calling function
findDoctorVisitingTime();



//Loop over the records
//Check whether the visiting record date is avaiable at Cleaning schedule
//based on the availability we need to insert the Cleaning schedule, if already available the delete and insert
// While insert  - need to consider cleaning schedule time shd not fall on dotor visiting time.


})