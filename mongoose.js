let mongoose = require('mongoose');
const myUri = process.env['MONGO_URI'];

const { User } = require('./models/User');

mongoose.connect(myUri, { useNewUrlParser: true, useUnifiedTopology: true });

const createUser = (username, done) => {
  let user = new User({ username });

  user.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const createExercise = (userId, exercise, done) => {
  User.findById(userId, async (err, user) => {
    if (err) return console.error(err);
    if (!user) return done(null, null);

    let newEx = {
      date: exercise.date ? new Date(exercise.date) : new Date(),
      duration: parseInt(exercise.duration),
      description: exercise.description
    };

    await user.log.push(newEx);
    user.save((err, data) => {
      if (err) return console.error(err);
      done(null, {
        _id: user._id,
        username: user.username,
        date: newEx.date.toDateString(),
        duration: newEx.duration,
        description: newEx.description
      });
    })
  })
}

const getUsers = (done) => {
  User.find({}, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const getUserLogs = (userId, { from, to, limit }, done) => {
  from = from ? new Date(from) : new Date(0);
  to = to ? new Date(to) : new Date();

  User.findById(userId, async (err, user) => {
    if (err) return console.error(err);
    if (!user) return done(null, null);

    let log = user.log
      .filter(ex => ex.date >= from && ex.date <= to)
      .map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }));

    if (limit) log = log.slice(0, limit);

    done(null, {
      _id: user._id,
      username: user.username,
      count: log.length,
      log
    });
  });
};

exports.createUser = createUser;
exports.createExercise = createExercise;
exports.getUsers = getUsers;
exports.getUserLogs = getUserLogs;