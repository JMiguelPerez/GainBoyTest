const router = require("express").Router();
const Customer = require("../models/customerModel");
const auth = require("../models/middleware/auth");

//add customer [add workout template]

// before handling async request will handle request through auth
router.post("/customer", auth, async (req, res) => {
  try {
    const { name } = req.body;
    //give customer name
    const newCustomer = new Customer({
      name,
    });
    //saves customer
    const savedCustomer = await newCustomer.save();

    res.json(savedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//find customer
router.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;