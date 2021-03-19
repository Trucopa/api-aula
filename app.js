const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
new Core();

const User = require("./schema/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Estava dando conflito, como vc não explicou como
// resolver conflitos, eu me limitei à comentar.

//app.get("/users", async (req, res)=>{
//    const user = await User.find();
//    return res.status(200).json({
//        data: user,
//    });
//});


// search by age
app.get("/users", async(req, res)=>{
    const user = await User.find({age: req.query.age});
    console.log(req.query.age)
    if(!user){
        return res.status(404).json({"error": "Usuario não encontrado"});
    }
    return res.status(200).json({
        data: user
    });
});

// search by cellphone
app.get("/user", async(req, res)=>{
    const user = await User.find({cell: req.query.cell});
    if(!user){
        return res.status(404).json({"error": "Usuario não encontrado"});
    }
    return res.status(200).json({
        data: user
    });
});

// limiting post to have a cellphone with 11 digits
app.post("/users", async (req, res)=>{
    if((await User.findById(req.body.id))) {
        return res.status(400).json({error: "Id ja existe na base de dados"});
    }

    if (req.body.cell.toString().length != 11){
        return res.status(400).json({error: "invalid cellphnone number"});
    }
    const user = {
        name: req.body.name,
        cpf: req.body.cpf,
        age: req.body.age,
        cell: req.body.cell
    };
    await (new User(user).save());
    return res.status(200).json({data: user});
});

app.patch("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            error: "Usuario não encontrado"
        });
    }
    await user.updateOne(req.body);
    return res.status(200).json({data: req.body});
});

app.delete("/users/:id", async (req, res)=>{
    return res.status(200).json({
        data: (await User.findOneAndRemove({_id: req.params.id}))
    });
});

app.listen(3000, ()=>{
    console.log("Server Started");
});