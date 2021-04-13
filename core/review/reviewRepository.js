'use strict';

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let db = new sqlite3.Database('./database.sqlite', async (error) => {
    if (error) {
        console.log(error);
        return;
    }

    db = await sqlite.open({ filename: './database.sqlite', driver: sqlite3.Database });
})

module.exports = {
    create,
    update,
    select,
    selectById
}

async function create(params) {
//********REMEMBER TO ADD THE NEM FIELDS */
    try {

        let tes = await db.all('select 1');

        let result = await db.all(`
            INSERT INTO review(
                raterName,
                raterEmail,
                raterDDD,
                raterPhone,
                rateWritten,
                rate,
                serviceprovider 
                createAt
            )
            VALUES(
                '${params.raterName}',
                '${params.raterEmail}',
                '${+params.raterDdd}',
                '${+params.raterPhone}',
                '${params.rateWritten}',
                '${+params.rate}',
                '${params.serviceProvider}',
                '${new Date().toISOString()}'
            );
        `);

        result = await db.all(`SELECT last_insert_rowid() as id;`);

        return result[0];
    } catch (error) {
        throw error;
    }
}

async function update(params) {
    try {

       
        return params.id;

    } catch (error) {
        throw error;
    }
}

async function select(params) {
    try {
        let result = await db.all(
            `
            SELECT 
                r.raterName as "raterName",
                r.raterEmail as "raterEmail",
                r.raterDDD as "raterDdd",
                r.raterPhone as "raterPhone",
                r.rateWritten as "rateWritten",
                r.rate,
                r.serviceprovider as "serviceProviderId"
                r.createAt as "createAt",
                sp.name
            FROM review r
            INNER JOIN serviceProvider sp
                ON r.serviceProviderId = sp.id 
            ORDER BY r.id asc
        `
        );

        return result;
    } catch (error) {
        throw error;
    }
}

async function selectById(params) {
    try 
    {

        let result = await db.all( `
        SELECT sp.name, sp.id FROM serviceProvider sp
            WHERE sp.id =  ${+params.id}
            ORDER BY sp.id ASC
        `);

        result[0].review = [];
        
        let reviewResult = await db.all(`
        SELECT * FROM review r
            WHERE r.id = ${+params.id}
            ORDER BY r.id ASC
        `);

        reviewResult.map(x => {
            result[0].review.push(x);
        });

        return result;
    } catch (error) {
        throw error;
    }
}
