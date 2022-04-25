const db = require("../models/index");
const { constants } = require("./constants");
const calendar = db.calendar;
const user = db.user;
require('dotenv').config();

exports.calendarController = {
  create: (req, res) => {
    const date = req.body.dutyDate;
    let period = req.body.period;
    if(period == "Morning"){
      period = "9 10 11 12"
    }else if(period == "Afternoon"){
      period = "1 2 3 4"
    }else{
      period = ""
    }
    const calend = {
      userId: req.body.userId,
      [date]: period
    };
      calendar  
        .update(calend, {include: {
                model: user,
                attributes:['userId']
            }})
        .then((data) => {
          res.status(200)
             .send({
               message: "Schedule added successfully"
              })
        })
        .catch((err) => {
          constants.handleErr(err, res);
        })
    },
  getAll: (req, res) => {
      calendar
        .findAll()
          .then((data) => {
              res.status(200)
                  .send(data)
          })
          .catch((err) => {
            constants.handleErr(err, res)
          })
  },
  getByCalendarId: (req, res) => {
      calendar
        .findOne({
          where: {
              id: req.body.id
          }
      })
      .then((data) => {
          res.status(200)
             .send(data)
      })
      .catch((err) => {
          constants.handleErr(err, res)
      })
  },
  getByDoctorId: (req, res) => {
      calendar
        .findAll()
         .then((data) => {
            let calendarObj = [];
            data.forEach((calendarData) => {
              if(data.userId == req.params.id){
                calendarObj.push(calendarData)
                }
            });
            res.status(200)
               .send({
                success: true,
                message: "Calendar retrieved successfully",
                data: calendarObj
               });
         })
         .catch((err) => {
             res.status(400)
                .send({
                  message: err.message || "Could not find record"
                })
         })
  },
  update: (req, res) => {
    const calend = req.body;
    // console.log(data)
    constants.convertToHour(calend)
    .then((data) => {
      calendar
        .update(calend, {
            where: {
                id: req.params.id
            }
        })
        .then((data) => {
          if(data[0] !== 1){
            res.status(404)
               .send({
                  message: "Record not found"
               });
            
           }
           res.status(200)
              .send({
                  message: "Record Updated Successfully"
              })
        })
        .catch((err) => {
            constants.handleErr(err, res);
        })
      })
  },
  delete: (req, res) => {
      calendar
        .destroy({
          where: {
            id: req.params.id 
            }
        })
        .then((data) => {
          if(data !== 1){
            res.status(404)
               .send({
                  message: "record not found"
                    })
            }
            res.status(200)
                .send({
                  message: "record deleted"
                })
        }).catch((err) => {
            res.status(400)
                .send({
                    message: "could not fetch record"
                })
        })
  }
}
