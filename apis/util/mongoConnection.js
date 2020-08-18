const {Connection, createConnection, connect} = require('mongoose')

const dbNames = {   //used by get Connection from req.baseUrl
    'sihJ20': 'Hack',
    'doist15': 'MyDoist15',
}
const allConnections = {}
const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

    retryWrites: true,
    w: 'majority'
}

const getConnection = (dbName) => { //works both ways... dbName can be a baseURL, or a proper one-word name
    if(allConnections[dbName]){
        return allConnections[dbName]
   }
    if(dbName.split('/').length > 1){
        dbName = dbName.split('/')[1]
    }else if(!dbName){
        return null
    }

    // const dbSource = process.env.DB_URI
    const dbSource = 'mongodb://localhost' //[DEBUG] This is mainly for debugging purpose, can easily replace all occurences directly with proces.env.DB_URI

    dbOptions.dbName = dbName   //modifying the dpOptions object
    let conn
    // try{
        console.log('creating connection with,', dbOptions.dbName);
            // ISSUE - When offline this will throw promisRejection, but using then and catch is giving promises no 
        conn = createConnection(dbSource, dbOptions)
        // conn = await createConnection(process.env.DB_URI, dbOptions)
            // .then(newConn => {
            //     // conn = newConn
            //     console.log('created it', newConn);
            //     return newConn
            // })
            // .catch(err => {
            //     console.log('some error')
            // })
                // .then(newConn => {
                //     console.log( "Connected to " + process.env.DB_URI.substr(0,15) + "..." )
                //     return newConn
                // })
                // .catch((err) => {
                //     console.log('Unable to connect to MONGODB cluster...', 'Trying to connect to localhost');
                //     conn = createConnection('mongodb://localhost/', dbOptions)
                //         .catch((err) => {
                //             console.error("Couldn't connect to MongoDB, neither online cluster, nor localhost", 'Start mongod, or connect to internet');
                //         })
                // })
    // }catch(err){
    //     console.log('Unable to connect to MONGODB cluster...', 'Trying to connect to localhost');
        // try{
        //     conn = createConnection('mongodb://localhost/', dbOptions)
        // }catch(err){
        //     console.error("Couldn't connect to MongoDB, neither online cluster, nor localhost", 'Start mongod, or connect to internet');
        // } 
    // }

    process
        .on('unhandledRejection', err => {
            console.error('unhandled error', err.code)
            conn = createConnection('mongodb://localhost', dbOptions)
            conn.once('once', () => console.log('CONNECTED'))
            conn.on('error', (err) => console.error('ERROR'))
        })

    conn
        .once('open', () => console.log("Connected to MongoDB, database: ", conn.db.databaseName))
        .on('error', (err) => console.error('Error in DB connection -> code: ', err))

    console.log('[DEBUG] Conn is an instance of connection: ', conn instanceof Connection);
    console.log('[DEBUG] Conn is ', conn instanceof Connection, 'Typeof(conn): ', typeof(conn));

    allConnections[dbName] = conn
    return conn
}

    //No longer use it
const ensureDBConnection = (req, res, next) => {
    try{
        const dbName = dbNames[req.baseUrl.split('/')[1]]
        console.log({
            currentDB: connection.db.databaseName,
            baseUrl: req.baseUrl,
            newDB: dbName
        })
        if(connection.db.databaseName !== dbName && dbName){
            console.log('Shifting db connection FROM', connection.db.databaseName, 'TO', dbName);
            // set('dbName', dbName)
            let newConnection = createConnection(dbName)
                //Q. Now how to use this connection? Will queries follow the newer connection, or the older one is kept as default ??

        }
    }catch(err){
        console.error('Error in ensureDB -> ', {
            currentDBName: connection.db.databaseName,
            baseUrl: req.baseUrl,
            newerDBName: dbName,
        });
    }
    next()
}

exports.getConnection = getConnection
