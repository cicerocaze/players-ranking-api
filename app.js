const express = require('express');
const mongoose = require('mongoose');



const app = express();
app.get('/', (req, res) => {
    res.send(JSON.stringify({
        Hello: 'World'
    }));
});

const uri = 'mongodb://heroku_pmbld7c8:ckio9obg6pgmmgbao9156rn9qr@ds021989.mlab.com:21989/heroku_pmbld7c8';
mongoose.connect(uri);

db.once('open', function callback() {
    // Create song schema
    let userSchema = mongoose.Schema({
        name: String,
        points: Number
    });
    // Store song documents in a collection called "songs"
    let User = mongoose.model('users', userSchema);
    // Create seed data
    let user = new User({
        name: 'Cícero',
        points: 3
    });
    let user2 = new User({
        name: 'Dorian',
        points: 1
    });
    let user3 = new User({
        name: 'Marcela',
        points: 2
    });
    
    //First we'll add a few songs. Nothing is required to create the
    //songs collection; it is created automatically when we insert.

    let list = [user, user2, user3]
    User.insertMany(list).then(() => {
        
        //Then we need to give Boyz II Men credit for their contribution
        //to the hit "One Sweet Day".
        
        return User.update({
            name: 'One Sweet Day'
        }, {
            $set: {
                points: 10
            }
        })
    }).then(() => {
        
        //Finally we run a query which returns all the hits that spend 10 or
        //more weeks at number 1.
        
        return User.find({
            name: {
                $gte: "Cícero"
            }
        }).sort({
            points: 0
        })
    }).then(docs => {
        docs.forEach(doc => {
            console.log(
                'Name: ' + doc['name'] + ', Pontos:' + doc['points']
            );
        });
    }).then(() => {
        // Since this is an example, we'll clean up after ourselves.
        return mongoose.connection.db.collection('players-ranking').drop()
    }).then(() => {
        // Only close the connection when your app is terminating
        return mongoose.connection.close()
    }).catch(err => {
        // Log any errors that are thrown in the Promise chain
        console.log(err)
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port !`);
});