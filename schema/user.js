const mongoose = require('mongoose');
const User = mongoose.model('User', { name: String, cpf: String, age: Number, cell: Number});
// const User = mongoose.model('User', { name: String, cpf: String});
module.exports = User;