const mongoose = require("mongoose");
const Users = require("../models/users");
const Students = require("../models/students");
const Psikolog = require("../models/psikolog");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const students_psikolog = require("../models/students_psikolog");

exports.login_process = (req, res, next) => {
  Users.findOne({
    email: req.body.email,
  })
    .populate("psikolog")
    .populate("students")
    .then((result) => {
      if (result == null) {
        res.status(404).json({
          message: "Users not found",
          error: new Error("Email not found"),
        });
      } else {
        bcrypt.compare(req.body.password, result.password, (error, compare) => {
          if (error) {
            throw new Error("Internal server error");
          }
          if (compare) {
            let date_1 = new Date();
            var token = jwt.sign(
              {
                _id: result._id,
                date: new Date(date_1.getTime() + 1000 * 60 * 60 * 9).getTime(),
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "12h",
              }
            );
            res.status(200).json({
              message: "Succesful login",
              user: result,
              token: token,
            });
          } else {
            res.status(401).json({
              message: "Password wrong",
              error: new Error("Invalid password"),
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Users not found",
        error: err,
      });
    });
};
exports.register_process = (req, res, next) => {
  if (req.body.isPsikolog === "YES") {
    let newPsikolog = new Psikolog({
      _id: mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      sipp: req.file.path,
      operation: req.body.operation,
    });
    newPsikolog
      .save()
      .then((response) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            if (req.file.path !== undefined && req.file.path !== null) {
              unlinkAsync(req.file.path);
            }
            Psikolog.deleteOne({ _id: newPsikolog._id })
              .then((response) => {
                res.status(500).json({
                  message: "Internal server error",
                  error: err,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: "Internal server error",
                  error: err,
                });
              });
          } else {
            let newUser = new Users({
              _id: mongoose.Types.ObjectId(),
              password: hash,
              email: req.body.email,
              profile: "/public/images/default/default_psikolog.png",
              psikolog: newPsikolog._id,
            });
            newUser
              .save()
              .then((result) => {
                let user = result;
                user.psikolog = newPsikolog;
                let date_1 = new Date();
                var token = jwt.sign(
                  {
                    _id: newUser._id,
                    date: new Date(
                      date_1.getTime() + 1000 * 60 * 60 * 9
                    ).getTime(),
                  },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: "12h",
                  }
                );
                res.status(201).json({
                  message: "Success to register psikolog",
                  users: user,
                  token: token,
                });
              })
              .catch((err) => {
                if (req.file.path !== undefined && req.file.path !== null) {
                  unlinkAsync(req.file.path);
                }
                Psikolog.deleteOne({ _id: newPsikolog._id })
                  .then((response) => {
                    if (err.keyPattern !== undefined) {
                      if (err.keyPattern.email !== undefined) {
                        res.status(409).json({
                          message: "Email already exist.",
                          error: err,
                        });
                      } else {
                        res.status(500).json({
                          message: "Internal server error",
                          error: err,
                        });
                      }
                    } else {
                      res.status(500).json({
                        message: "Internal server error",
                        error: err,
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(500).json({
                      message: "Internal server error",
                      error: err,
                    });
                  });
              });
          }
        });
      })
      .catch((err) => {
        if (req.file.path !== undefined && req.file.path !== null) {
          unlinkAsync(req.file.path);
        }
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      });
  } else {
    let newStudents = new Students({
      _id: mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      parentsPhoneNumber: req.body.parentsPhoneNumber,
    });
    newStudents
      .save()
      .then((response) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            Students.deleteOne({ _id: newStudents._id })
              .then((response) => {
                res.status(500).json({
                  message: "Internal server error",
                  error: err,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: "Internal server error",
                  error: err,
                });
              });
          } else {
            let newUser = new Users({
              _id: mongoose.Types.ObjectId(),
              password: hash,
              email: req.body.email,
              profile: "/public/images/default/default_student.png",
              students: newStudents._id,
            });
            newUser
              .save()
              .then((result) => {
                let user = result;
                user.students = newStudents;
                let date_1 = new Date();
                var token = jwt.sign(
                  {
                    _id: newUser._id,
                    date: new Date(
                      date_1.getTime() + 1000 * 60 * 60 * 9
                    ).getTime(),
                  },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: "12h",
                  }
                );
                res.status(201).json({
                  message: "Success to register students",
                  users: user,
                  token: token,
                });
              })
              .catch((err) => {
                Students.deleteOne({ _id: newStudents._id })
                  .then((response) => {
                    if (err.keyPattern !== undefined) {
                      if (err.keyPattern.email !== undefined) {
                        res.status(409).json({
                          message: "Email already exist.",
                          error: err,
                        });
                      } else {
                        res.status(500).json({
                          message: "Internal server error",
                          error: err,
                        });
                      }
                    } else {
                      res.status(500).json({
                        message: "Internal server error",
                        error: err,
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(500).json({
                      message: "Internal server error",
                      error: err,
                    });
                  });
              });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      });
  }
};
exports.get_psikolog = (req, res, next) => {
  Users.find({ psikolog: { $ne: null } })
    .populate("psikolog")
    .select("_id email profile psikolog")
    .then((result) => {
      res.status(200).json({
        message: "Succes to get psikolog",
        count: result.length,
        psikolog: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};

exports.get_psikolog_students = (req, res, next) => {
  students_psikolog
    .find({
      student: req.body.id,
    })
    .then((result) => {
      let ids = [];
      result.forEach((item) => {
        ids.push(item.psikolog);
      });
      ids.push(req.body.id);
      Users.find({ _id: { $nin: ids }, psikolog: { $ne: null } })
        .populate("psikolog")
        .select("_id email profile psikolog")
        .limit(Number(req.body.limit))
        .skip(Number(req.body.skip))
        .then((result1) => {
          res.status(200).json({
            message: "Succes to get psikolog",
            count: result1.length,
            psikolog: result1,
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

exports.get_students = (req, res, next) => {
  Users.find({ students: { $ne: null } })
    .populate("students")
    .select("_id email profile students")
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          message: "Succes to get students",
          count: result.length,
          psikolog: result,
        });
      } else {
        res.status(404).json({
          message: "No one students now",
          error: err,
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
