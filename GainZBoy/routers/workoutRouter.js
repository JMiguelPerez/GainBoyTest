const router = require("express").Router();
const Workout = require("../models/workoutModel");
const auth = require("../models/middleware/auth");

var mongo = require('mongodb');



// add workout [add workout template]

// before handling async request will handle request through auth
router.post("/createWorkout", auth, async (req, res) => {
  try {
    const { name, userId, reps, sets, totalWeight, timeSpent } = req.body;

    // while (Workout.findOne({ name: name, userId: userId })) {

    // }

    //give workout name
    const newWorkout = new Workout({
      name,
      userId,
      reps,
      sets,
      totalWeight,
      timeSpent
    });
    //saves workout
    const savedWorkout = await newWorkout.save();

    res.json(savedWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});



// returns all workouts belonging to a user
router.post("/displayWorkouts", auth, async (req, res) => {

  const { userId } = req.body;
  try {

    Workout.find({ userId })
      .then(result => {
        console.log({ result });
        res.json({
          results: result,
        })
      })

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


// updates a workout based on a workout ID
router.post("/updateWorkout", auth, async (req, res) => {


  const { _id: _id, name: name, userId: userId, reps: reps, sets: sets, totalWeight: totalWeight, timeSpent: timeSpent } = req.body;
  var newvalues = { $set: { name: name, userId: userId, reps: reps, sets: sets, totalWeight: totalWeight, timeSpent: timeSpent } };

  Workout
    .findOne({ _id: mongo.ObjectId(_id) })
    .then(result => {
      (async () => await Workout.updateOne(result, newvalues))()
      res.json({
        status: true,
        message: "updated",
      })
    })

});

router.post("/deleteWorkout", auth, async (req, res) => {

  const { _id: _id } = req.body;
  //give workout name
  try {

    Workout.findOne({ _id: mongo.ObjectId(_id) })
      .then(result => {
        console.log({ result });
        (async () => await Workout.deleteOne(result))()
        res.json({
          status: "true",
          message: "Workout removed",
        })
      })

  }
  catch (error) {
    return res.json(error);
  }
}
);

// //find workout
// router.get("/", auth, async (req, res) => {
//   try {
//     const workouts = await Workout.find();
//     res.json(workouts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send();
//   }
// });

module.exports = router;