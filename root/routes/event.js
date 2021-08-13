const express = require('express');
const router = express.Router();
const Event = require('../models/event')
const Participant = require('../models/participant')
const isAuthenticated = require('./auth')
const mongoose = require('mongoose');
//npm package: dateformat
//resource: https://www.npmjs.com/package/dateformat
const dateFormat = require("dateformat");

/* GET events/index page. */
router.get('/', function (req, res, next) {
  Event.find((err, events) => {
    if (err)
      console.log(`Events add get error: ${err}`);
    else {
      Participant.find((err, participants) => {
        if (err)
          console.log(`event find participants error: ${err}`);
        else {
          // loose mongodb response object constrains
          events = JSON.parse(JSON.stringify(events));
          events.map(event => {
            let newDate = new Date(event.date);
            event['date'] = newDate.toLocaleString();
            event['_id'] = mongoose.Types.ObjectId(event._id);
            // count participants
            let eventParticipants = participants.filter(paticipant => {
              return paticipant.eventId.equals(event._id)
            });
            event['participants'] = eventParticipants.length;
            //differ whether user is the initiator or participant
            if (req.user) {
              event['isRegistered'] = !(eventParticipants.find(paticipant => {
                return paticipant.userId.equals(req.user._id)
              }) == undefined);
              event['isInitEuqual2User'] = req.user._id.equals(event.initiatorId._id);
            }
          })
          res.render('events/index', {
            events: events,
            user: req.user
          });
        }
      })
    }
  }).populate('initiatorId').sort({
    date: -1
  });
});

/* GET events/add page. */
router.get('/add', isAuthenticated, function (req, res, next) {
  res.render('events/add', {
    user: req.user
  });
});

router.post('/add', isAuthenticated, function (req, res, next) {
  //create event
  Event.create({
      sportId: req.body.sportId,
      date: req.body.date,
      initiatorId: req.body.initiatorId,
      location: req.body.location,
      sport: req.body.sport
    },
    (err, newEvent) => {
      if (err) {
        console.log("event add post error: " + err);
      } else {
        //add one participant of initiator
        Participant.create({
          eventId: newEvent._id,
          userId: newEvent.initiatorId
        }, (err, participant) => {
          if (err) {
            console.log("participant add post error: " + err);
          } else {
            res.redirect('/events');
          }
        })
      }
    })
});
//reder event/update page and hide id by using POST method rather than using GET
router.post('/update', isAuthenticated, function (req, res, next) {
  Event.findById(req.body.eventId, (err, event) => {
    if (err)
      console.log(`Events add get error: ${err}`)
    else {
      let newDate = new Date(event.date);
      // loose mongodb response object constrains
      event = JSON.parse(JSON.stringify(event));
      event['date'] = dateFormat(newDate, "yyyy-mm-dd'T'HH:MM:ss");;
      res.render('events/update', {
        event: event,
        user: req.user
      });
    }
  });
});
//
router.post('/update-confirm', isAuthenticated, function (req, res, next) {
  Event.findOneAndUpdate({
      _id: req.body.eventId
    }, {
      sport: req.body.sport,
      date: req.body.date,
      initiatorId: req.body.initiatorId,
      location: req.body.location
    },
    (err, updatedEvent) => {
      if (err)
        console.log(`update confirmation error : ${err}`);
      else {
        res.redirect('/account/myevent');
      }
    });
});

router.post('/delete', isAuthenticated, function (req, res, next) {
  //delete all participants from the event
  //delete event
  Participant.deleteMany({
    eventId: req.body.eventId
  }, (err, deletedParticipant) => {
    if (err)
      console.log(`delete participant from event error: ${err}`);
    else {
      Event.deleteOne({
        _id: req.body.eventId
      }, (err, deletedEvent) => {
        if (err) {
          console.log("event delete post error: " + err);
        } else {
          res.redirect('/events');
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
      console.log(`delete participant from event error: ${err}`);
    else {
      res.redirect('/events');
    }
  })

});
//user register event
router.post('/register', isAuthenticated, function (req, res, next) {
  Participant.create({
    eventId: req.body.eventId,
    userId: req.body.userId
  }, (err, participant) => {
    if (err)
      console.log(`delete participant from event error: ${err}`);
    else {
      res.redirect('/events');
    }
  });

});

module.exports = router;