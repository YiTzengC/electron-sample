var express = require('express');
var router = express.Router();
const isAuthenticated = require('./auth');
const User = require('../models/user');
var multer = require('multer');
//npm package: multer
//set storage path
//resource: https://www.npmjs.com/package/multer
var upload = multer({
  dest: 'public/images/'
});
const fs = require('fs')
const path = require('path');
const Event = require('../models/event');
const mongoose = require('mongoose');
const Participant = require('../models/participant');


/* GET account index page. */
router.get('/', isAuthenticated, function (req, res, next) {
  res.render('account/index', {
    user: req.user
  });
});

//update image only
router.post('/', upload.single('upload'), isAuthenticated, function (req, res, next) {
  if (req.file) {
    if (req.user.image != 'profile.png') {
      fs.rm(path.join(__dirname, '..', 'public', 'images', req.user.image), (err) => {
        if (err)
          console.log(`fs rm error: ${err}`);
      })
    }
  } else {
    console.log('no file uploaded');
  }
  User.findByIdAndUpdate(req.user._id, {
    $set: {
      image: req.file.filename
    }
  }, (err, updateUser) => {
    if (err)
      console.log(`update account image error: ${err}`);
    res.redirect('/account');
  })
});

/* GET account/myevent page. */
router.get('/myevent', isAuthenticated, function (req, res, next) {
  Event.find({
    initiatorId: req.user._id
  }, (
    err, events) => {
    if (err)
      console.log(`Events add get error: ${err}`)
    else {
      Participant.find((err, participants) => {
        if (err)
          console.log(`event find participants error: ${err}`)
        else {
          events = JSON.parse(JSON.stringify(events))
          events.map(event => {
            let newDate = new Date(event.date)
            event['date'] = newDate.toLocaleString()
            event['_id'] = mongoose.Types.ObjectId(event._id)
            // count participants
            let eventParticipants = participants.filter(paticipant => {
              return paticipant.eventId.equals(event._id)
            })
            event['participants'] = eventParticipants.length
          })
          res.render('account/myevent', {
            events: events,
            user: req.user
          })
        }
      })
    }
  }).populate('initiatorId').sort({
    date: -1
  })
});

/* GET account/joined-event page. */

router.get('/joined-event', isAuthenticated, function (req, res, next) {
  Event.find((err, events) => {
    if (err)
      console.log(`Events add get error: ${err}`)
    else {
      Participant.find((err, participants) => {
        if (err)
          console.log(`event find participants error: ${err}`)
        else {
          events = JSON.parse(JSON.stringify(events))
          events = events.filter(event => {
            let newDate = new Date(event.date);
            event['date'] = newDate.toLocaleString();
            event['_id'] = mongoose.Types.ObjectId(event._id);
            // count participants
            let eventParticipants = participants.filter(paticipant => {
              return paticipant.eventId.equals(event._id);
            })
            event['participants'] = eventParticipants.length
            // filter user's joined events only
            //participant != initiator
            return !(eventParticipants.find(paticipant => {
              return paticipant.userId.equals(req.user._id);
            }) == undefined) && !req.user._id.equals(event.initiatorId._id);
          })
          console.log(events)
          res.render('account/joined-event', {
            events: events,
            user: req.user
          });
        }
      })
    }
  }).populate('initiatorId').sort({
    date: -1
  })
});

//delete event along with all participants of the event
router.post('/delete', isAuthenticated, function (req, res, next) {
  Participant.deleteMany({
    eventId: req.body.eventId
  }, (err, deletedParticipant) => {
    if (err)
      console.log(`account delete participant from event error: ${err}`);
    else {
      Event.deleteOne({
        _id: req.body.eventId
      }, (err, deletedEvent) => {
        if (err) {
          console.log("account event delete post error: " + err);
        } else {
          res.redirect('/account/myevent');
        }
      });
    }
  });
});

//user withdraw from event
router.post('/withdraw', isAuthenticated, function (req, res, next) {
  //delete user from participant
  Participant.deleteOne({
    eventId: req.body.eventId,
    userId: req.body.userId
  }, (err, deletedParticipant) => {
    if (err)
      console.log(`account delete participant from event error: ${err}`);
    else {
      res.redirect('/account/joined-event');
    }
  })

});

module.exports = router;