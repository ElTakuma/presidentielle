const User = require('../models/user.model');
let connection = require('../models/db')
const database = require("../models/db");
const bcrypt = require("bcrypt");

exports.findAll = (req, res) => {
    const nom = req.query.nom;

    User.findAll(nom, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        } else {
            res.render('index', {title: 'Presidentielle 2022', data});
        }
    });
};

exports.create = (req, res)  => {
    let nbr = 0;
    const nom = null;
    let user = {};
    User.findAll(nom, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        } else {
            nbr = data.length + 1;
            const salt = bcrypt.genSaltSync(10);
            user = {
                'prenom': req.body.prenom,
                'code' : 'C-0000' + nbr,
                'password': bcrypt.hashSync('test1234', salt),
            };

            User.create(user, (err, data) =>{
                if (err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the User."
                    });
                else res.render('info-connexion', {title: 'Informations de connexion', data});
            })
            console.log('****** ' + user)
        }
    });
}

exports.edit = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with id " + req.params.id
                });
            }
        } else res.render('edit-info', {title: 'Editez vos informations', data});
    });
}

exports.update = (req, res) => {
    let user = {};
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    console.log(req.body);

    User.updateById(
        req.params.id,
        new User(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating User with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
}