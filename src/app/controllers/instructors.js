const { age, date } = require('../../lib/utils')
const { connectToDatabase } = require('../../config/db')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    index(req, res){
        connectToDatabase()
            .then(async (client) => {
                try {
                    const session = await client.openSession();

                    // Fetch all data from the bronze.capacidade_producao table
                    const query = 'SELECT * FROM bronze.capacidade_producao';
                    const queryOperation = await session.executeStatement(
                        statement = query,
                        options = { runAsync: true }
                    );

                    const result = await queryOperation.fetchAll();

                    await session.close();

                    // Pass the data to the index.njk template
                    return res.render('instructors/index', { instructors: result });
                } catch (error) {
                    console.log("Database Error:", error);
                    return res.send("Database Error");
                } finally {
                    client.close();
                }
            })
            .catch((error) => {
                console.log("Database Connection Error:", error);
                return res.send("Database Connection Error");
            });
    },
    create(req, res){
        return res.render('instructors/create')
    },
    post(req, res) {
        // Performing validation
        const keys = Object.keys(req.body);
        for (key of keys) {
            if (req.body[key] === "") {
                return res.send('Please, fill all fields');
            }
        }

        const id = uuidv4();

        const query = `
            INSERT INTO bronze.capacidade_producao (
                id,
                ano,
                capacidade,
                mes,
                category
            ) VALUES ('${id}', '${req.body.ano}', '${req.body.capacidade}', '${req.body.mes}', '${req.body.category}')
        `;

        // Establish the database connection using connectToDatabase function
        connectToDatabase()
            .then(async (client) => {
                try {
                    const session = await client.openSession();

                    const queryOperation = await session.executeStatement(
                        statement = query,
                        options = { runAsync: true }
                    );

                    await queryOperation.completionPromise;

                    await session.close();

                    console.log('Inserted successfully.');

                    return res.redirect(`/instructors`);
                } catch (error) {
                    console.log("Database Error:", error);
                    return res.send("Database Error");
                } finally {
                    client.close();
                }
            })
            .catch((error) => {
                console.log("Database Connection Error:", error);
                return res.send("Database Connection Error");
            });
        
    },
    show(req, res){
        const { id } = req.params;

        // Establish the database connection using connectToDatabase function
        connectToDatabase()
            .then(async (client) => {
                try {
                    const session = await client.openSession();

                    // Fetch the instructor data from the bronze.capacidade_producao table based on the provided id
                    const query = `SELECT * FROM bronze.capacidade_producao WHERE id = '${id} ORDER BY mes_num ASC'`;
                    const queryOperation = await session.executeStatement(
                        statement = query,
                        options = { runAsync: true }
                    );

                    const result = await queryOperation.fetchAll();

                    await session.close();

                    // If instructor data found, pass it to the edit.njk template
                    if (result.length > 0) {
                        return res.render('instructors/edit', { instructor: result[0] });
                    } else {
                        return res.send('Instructor not found.');
                    }
                } catch (error) {
                    console.log("Database Error:", error);
                    return res.send("Database Error");
                } finally {
                    client.close();
                }
            })
            .catch((error) => {
                console.log("Database Connection Error:", error);
                return res.send("Database Connection Error");
            });
    },
    edit(req, res){
        return
    },
    put(req, res){
        const keys = Object.keys(req.body)//o keys criou um array com as chaves dos objetos

        for(key of keys){
            if (req.body[key] == ""){
                return res.send('Please, fill all fields') 
            }
        }

        return
    },
    delete(req, res) {
        const { id } = req.body;

        connectToDatabase()
            .then(async (client) => {
                try {
                    const session = await client.openSession();

                    const query = `
                        DELETE FROM bronze.capacidade_producao
                        WHERE id = '${id}'
                    `;

                    const queryOperation = await session.executeStatement(query, {
                        runAsync: true,
                    });

                    await queryOperation.completionPromise;

                    await session.close();
                    client.close();

                    console.log('Instructor deleted successfully.');
                    return res.redirect('/instructors');
                } catch (error) {
                    console.log('Database Error:', error);
                    return res.send('Database Error');
                } finally {
                    client.close();
                }
            })
            .catch((error) => {
                console.log('Database Connection Error:', error);
                return res.send('Database Connection Error');
            });
    },
}
