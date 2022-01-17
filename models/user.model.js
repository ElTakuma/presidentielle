const database = require('../models/db')

const User = function (user) {
    this.code = user.code;
    this.nom = user.nom;
    this.prenom = user.prenom;
    this.age = user.age;
    this.parti = user.parti;
    this.budget = user.budget;
    this.password = user.password;
}

User.findAll = (nom, result) => {
    let sql = "SELECT * FROM users";

    if (nom) sql += `WHERE nom LIKE '%${nom}%' `;

    database.query(sql, (err, res) =>{
        if (err) {
            console.error(err);
            result(null, err);
            return;
        }

        console.log('Users: ' + JSON.stringify(res));
        result(null,Object.values(JSON.parse(JSON.stringify(res))));
    })
}

User.create = (newUser, result) => {
    database.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.info('Candidat cree: ', {id: res.insertId, ...newUser});
        result(null,{ id: res.insertId, ...newUser })
    })
}

User.findById = (id, result) => {
    database.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found User with the id
        result({ kind: "not_found" }, null);
    });
};

User.updateById = (id, user, result) => {
    database.query(
        "UPDATE users SET nom = ?, prenom = ?, age = ?, parti = ?, budget = ? WHERE id = ?",
        [user.nom, user.prenom, user.age, user.parti, user.budget, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows === 0) {
                // not found user with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated user: ", { id: id, ...user });
            result(null, { id: id, ...user });
        }
    );
};



module.exports = User;