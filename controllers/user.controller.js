const User = require('../models/user.model');
let connection = require('../models/db')
const database = require("../models/db");
const bcrypt = require("bcrypt");
let formidable = require('formidable');
let fs = require('fs');

/**
 * Affiche la page d'accueil avec la liste des candidats filtré
 * @param req
 * @param res
 */
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

/**
 * Creqtion d'un nouveau cadidat
 * @param req
 * @param res
 */
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
            user = {
                'prenom': req.body.prenom,
                'code' : 'C-0000' + nbr
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

/**
 * Afiche la page de mise a jour des informations d'un candidat
 * @param req
 * @param res
 */
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

/**
 * Mise a jour des informations d'un candidat
 * @param req
 * @param res
 */
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
            } else res.redirect('/users/show/'+ req.params.id);
        }
    );
}

/**
 * Affiche la page des details sur un candidat
 * @param req
 * @param res
 */
exports.show = (req, res) => {
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
        } else res.render('show', {title: 'Editez vos informations', data});
    });
}

/**
 * Importe une image de candidat
 * @param req
 * @param res
 */
exports.upload = (req, res) => {
    let user = {};

    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('test if execute');
        let oldpath = files.image.filepath;
        let newpath = process.cwd() + '/images/' + files.image.originalFilename;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.info('File uploaded and moved!');

            user = { "image" : files.image.originalFilename,}
            User.updateById(
                req.params.id,user,
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
                    } else res.redirect('/users/show/'+ req.params.id);
                }
            );
            // res.end();
        });
    });
}

/**
 * Retire un cadidat de la course
 * @param req
 * @param res
 */
exports.removeCandidate = (req, res) => {
    let user = { "candidatureOff": true };
    console.log('===> '+ user);
    User.exitToCourse(
        req.params.id, user,
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
            } else res.redirect('/users/show/'+ req.params.id);
        }
    );
}

/**
 * Faire entrer un candidat dans la liste des candidats en course
 * @param req
 * @param res
 */
exports.confirmCandidate = (req, res) => {
    let user = { "parrainage": true };
    console.log('===> '+ user);
    User.confirmCandidate(
        req.params.id, user,
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
            } else res.redirect('/users/show/'+ req.params.id);
        }
    );
}
