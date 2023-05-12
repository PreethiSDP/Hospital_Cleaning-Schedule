const mongoose = require("mongoose");
const connection = "mongodb+srv://Fidgeting:0J5XSU55nH56Mijw@testcluster.vnwjzfa.mongodb.net/Preethi1?retryWrites=true&w=majority";
//const Hospital_CleaningScheduleModel = require("./models/Hospital_CleaningScheduleModel");
const Hospital_DoctorVisitModel = require("./models/Hospital_DoctorVisitModel");
const Hospital_FloorsModel = require("./models/Hospital_FloorsModel");
const Hospital_RoomSensorModel = require("./models/Hospital_RoomSensorModel");
const Hospital_RoomsModel = require("./models/Hospital_RoomsModel");
//const Date = require('date-utils');

const floors = 3;
const rooms = 5;

//Get data from Mongo DB
mongoose.connect(connection)
    .then(()=>console.log("successfully connected DB"))
    .catch(err => console.log(err));

const createFloor = async ()=>{
    try{
        for(var i=1; i<=floors; i++)
        {
            //Inserting Floor Details
            const floorsSchema = new Hospital_FloorsModel({
                floor_id: i,
                number_of_rooms: rooms,
            });
            const saveFloor = await floorsSchema.save();

            // Inserting Room Details
            for(var j=1; j<=rooms; j++)
            {
                const roomsSchema = new Hospital_RoomsModel({
                    floor_id:saveFloor.floor_id,
                    room_number:j,
                    room_type:'Patient Room'
                });
                const saveRoom = await roomsSchema.save();
                //console.log(saveRoom);

                // Inserting Room Sensor details
                const sensorSchema = new Hospital_RoomSensorModel({
                    floor_id: saveFloor.floor_id,
                    room_number: saveRoom.room_number,
                    sensor_code: randomHash("alpSpecLower", 10)
                });
                const saveSensor = await sensorSchema.save();
            }

            //Inserting Visiting Time(below day value+1)
            var day = 1;

            for (var k = 0; k<=day; k++){
                var today = new Date();
                var starthour = rnd(9, 16);
                
                var setDateForFloorVisit = new Date(today.setDate(today.getDate() + k));
                setDateForFloorVisit = new Date(setDateForFloorVisit.setHours(starthour));

                const visitingSchema = new Hospital_DoctorVisitModel({
                    floor_id: saveFloor.floor_id,
                    visiting_time: setDateForFloorVisit,
                    duration: rnd(1, 4),
                    datepart: setDateForFloorVisit.getDate()
                });

                //const saveVisiting = await visitingSchema.save();
            }
        }
        console.log('Inserted');
        process.exit(1);
    }catch(err){console.log(err);}
};

function rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomHash(format, length) {
    let pool = "";
  
    switch (format) {
      case "alnum":
        pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        break;
      case "alpSpecLower":
        pool = "abcdefghijklmnopqrstuvwxyz-_";
        break;
      case "alpha":
        pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        break;
      case "alpNumLower":
        pool = "0123456789abcdefghijklmnopqrstuvwxyz";
        break;
      case "hexdec":
        pool = "0123456789abcdef";
        break;
      case "numeric":
        pool = "0123456789";
        break;
      case "nozero":
        pool = "123456789";
        break;
      default:
        return "";
    }
  
    let buf = "";
  
    for (let i = 0; i < length; i++) {
      buf += pool.charAt(Math.floor(Math.random() * pool.length));
    }
  
    return buf;
  }

  createFloor();
  