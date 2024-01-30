const { faker } = require("@faker-js/faker");
const transactionModel = require("../models/transaction.js");
module.exports.get = async (req, res) => {
    const user = req.body.user;
    // const find = await transactionModel.find({ user: user?._id }).populate('user', 'firstName').lean()

    const find = await transactionModel.find({}).sort({ date: -1 }).lean()
    res.json(find)
}
module.exports.post = async (req, res) => {
    const { name, description, price } = req.body
    for (let i = 0; i < 100; i++) {
        await transactionModel.create({ name: faker.internet.userName(), price: faker.number.int(), image: faker.image.abstract(), description: faker.lorem.paragraph(), date: faker.date.anytime() })
    }
    res.json()
}