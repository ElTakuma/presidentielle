const mysql = require("mysql");
let dbConfig = require('../config/db.config')
const bcrypt = require("bcrypt");

let connection_db = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
let connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD
});

connection_db.connect(function (err) {
    if (err){
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('1 ==> ACCESS TO SERVER DENIED.');
            // throw 'ACCESS TO SERVER DENIED.';
            process.exit(1);
        }
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('===> Database NOT FOUND.');
            console.log('===>Creating Database =>\' ' + dbConfig.DB + '\'');

            connection_db.end();

            connection.connect(function (err) {
                console.error('===> ************************************');
                if (err){
                    console.error('2 ==> ACCESS TO SERVER DENIED.'+err);
                    // throw 'ACCESS TO SERVER DENIED.';
                    process.exit(1);
                } else {
                    connection.query("CREATE DATABASE " + dbConfig.DB , function (err, result) {
                        if (err) {
                            console.error('Error to create the database. - '+ err);
                            process.exit(1);
                        } else {
                            console.info('Database # ' + dbConfig.DB + ' # created');
                            console.log('');

                            connection.end();

                            let con = mysql.createConnection({host: dbConfig.HOST, user: dbConfig.USER, password: dbConfig.PASSWORD, database: dbConfig.DB});

                            con.connect(function (err) {
                                if (err) {
                                    // console.error('===> Database NOT FOUND.');
                                    console.error('===> SQL ERROR - ' +err );
                                }
                                if (!err) {
                                    console.log('===>Creating Table =>\' users\'');
                                        con.query("CREATE TABLE users (id BIGINT AUTO_INCREMENT PRIMARY KEY UNIQUE ,code VARCHAR(100) NOT NULL , nom VARCHAR(150), prenom VARCHAR(100), age INT(5), parti VARCHAR(255), role VARCHAR(255) DEFAULT 'candidat', budget INT(20), parrainage BOOLEAN DEFAULT false, password VARCHAR(255) NOT NULL );",
                                        function (err, result) {
                                            if (err) {
                                                console.error('Error to create the table. create it manually. - ' + err);
                                                process.exit(1);
                                            } else {
                                                console.info('Table # users # created');
                                                console.log('');
                                                console.info('Table # users # ====> Insertion of users records');

                                                const salt = bcrypt.genSaltSync(10);
                                                const password = bcrypt.hashSync('test1234', salt);

                                                let userData = [
                                                    ['C-001', 'Macron', 'Emmanuel', true, password],
                                                    ['C-002', 'Pécresse', 'Valérie', true, password],
                                                    ['C-003', 'Le Pen', 'Marine', true, password],
                                                    ['C-004', 'Mélenchon', 'Jean-Luc', true, password],
                                                    ['C-005', 'Jadot', 'Yann', true, password],
                                                    ['C-006', 'Hidalgot', 'Anne', true, password]
                                                ];

                                                con.query("INSERT INTO users (code, nom, prenom, parrainage, password) VALUES ?" , [userData], function (err, result) {
                                                    if (err){
                                                        console.error('====> '+ err);
                                                    }
                                                    console.log("Number of records inserted: " + result.affectedRows);
                                                })
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });

        }
        console.log('');
        // console.info("Start again your server");
        // process.exit(1);
    }


    console.log('connected as id ' + connection_db.threadId);
});

module.exports = connection_db;