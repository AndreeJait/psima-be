const mongoose = require("mongoose");
const message = require("../models/message");
const StudentsPsikolog = require("../models/students_psikolog");

exports.add_new_friend = (req, res, next) => {
  StudentsPsikolog.findOne({
    student: req.body.student,
    psikolog: req.body.psikolog,
  })
    .then((result) => {
      if (result === null) {
        let new_friend = new StudentsPsikolog({
          _id: mongoose.Types.ObjectId(),
          student: req.body.student,
          psikolog: req.body.psikolog,
          message: [],
          updatedAt: new Date().getTime(),
        });
        new_friend
          .save()
          .then((result1) => {
            res.status(201).json({
              message: "Succes add new friend",
              _id: new_friend._id,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Internal server error",
              error: err,
            });
          });
      } else {
        res.status(401).json({
          message: "Friend already exist",
          error: new Error("Already exists"),
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};

exports.add_new_message = (req, res, next) => {
  let date = new Date();
  let isPsikolog = false;
  if (req.body.isPsikolog == true || req.body.isPsikolog == "YES") {
    isPsikolog = true;
  }

  let new_message = new message({
    _id: mongoose.Types.ObjectId(),
    date: date.toISOString(),
    message: req.body.message,
    isPsikolog: isPsikolog,
  });

  new_message
    .save()
    .then((result) => {
      StudentsPsikolog.updateOne(
        {
          student: req.body.student,
          psikolog: req.body.psikolog,
        },
        { $push: { message: new_message._id }, updatedAt: new Date().getTime() }
      )
        .then((result1) => {
          res.status(201).json({
            message: "Succes to send message",
            _id: new_message._id,
            date: date.toISOString(),
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Internal server error",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};

exports.get_all_message = (req, res, next) => {
  StudentsPsikolog.findOne({
    student: req.body.student,
    psikolog: req.body.psikolog,
  })
    .populate({
      path: "message",
      options: {
        sort: { date: -1 },
        limit: Number(req.body.limit),
        skip: Number(req.body.skip),
      },
    })
    .sort({ updatedAt: -1 })
    .then((result) => {
      res.status(200).json({
        count: result.message.length,
        message: "Succes to get message",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};

exports.get_all_friend = (req, res, next) => {
  StudentsPsikolog.find({
    $or: [{ student: req.body.student }, { psikolog: req.body.psikolog }],
  })
    .populate({
      path: "student",
      select: "_id profile students",
      populate: { path: "students", select: "fullName" },
    })
    .populate({
      path: "psikolog",
      select: "_id profile psikolog",
      populate: { path: "psikolog", select: "fullName" },
    })
    .sort({ updatedAt: "desc" })
    .limit(Number(req.body.limit))
    .skip(Number(req.body.skip))
    .then((result) => {
      res.status(200).json({
        message: "Succes To get Data",
        data: result,
        count: result.length,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};
