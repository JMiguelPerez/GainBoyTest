//// get works, this is a **vital** test case, probably
//// the most important piece of code here
// router.get("/test", (req, res) => {
//     res.json({
//       poop: "pooooop",
//     })
//   });
  
   
//
// router.post("/test", async (req, res) => {
//     try {
//         const { test } = req.body;

//         return res.json({ youput: test });
//     }
//     catch
//     {
//         return res.json(error);
//     }
// })


// // testing delete

// router.post("/deleteUser", async (req, res) => {
//     try {
//         const { email } = req.body;

//         // const existingUser = await User.findOne({ userID })

//         User.findOne({ email })
//             .then(result => {
//                 console.log({ result });
//                 (async () => await User.deleteOne(result))()
//                 res.json({
//                     status: "done",
//                 })
//             })
//             .catch(error => {
//                 console.log(error);
//             })

//     }
//     catch (error) {
//         return res.json(error);
//     }
// })

// router.post("/deleteVer", async (req, res) => {
//     try {
//         const { userId } = req.body;

//         userVerification.findOne({ userId })
//             .then(result => {
//                 console.log({ result });
//                 (async () => await userVerification.deleteOne(result))()
//                 res.json({
//                     status: "done",
//                 })
//             })

//     }
//     catch (error) {
//         return res.json(error);
//     }
// })