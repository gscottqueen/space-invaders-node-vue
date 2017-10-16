var Invasions = require('../models/invasionModel');
var bodyParser = require('body-parser');


module.exports = {
    findById: function(req, res) {
        Invasions.find({ _id: req.params.id }, function(err, invasions){
            if (err) throw err;
            res.send(invasions);
        });
    },
    findByQuery: function(req, res) {
        // Sanitize the query before passing it to db
        var query = {};
        if (req.query.email) query.email = req.query.email;
        if (req.query.invasion) query.invasion = req.query.invasion;
        if (req.query.location) query.location = req.query.location;
        if (req.query.when) query.when = req.query.when;
        if (req.query.confirmed) query.confirmed = req.query.confirmed;

        Invasions.find( query, function(err, invasions){
            if (err) throw err;
            res.send(invasions);
        })
    },
    findByDay: function(req, res){
        
        var start = new Date(Date.UTC(req.params.year, req.params.month-1, req.params.day, 0, 1));
        var end = new Date(Date.UTC(req.params.year, req.params.month-1, req.params.day, 23, 59));
        
        Invasions.find ( {when: {$gte: start, $lt: end}}, function(err, invasions){
            if (err) throw err;
            res.send(invasions);
        }).sort({when: 1})
    },
    createOrUpdateInvasion: function(req, res){
        if (req.body.id){
            Invasions.findByIdAndUpdate(req.body.id, {
                email: req.body.email, invasion: req.body.invasion, location: req.body.location, when: req.body.when, confirmed: false 
            }, function(err, todo){
                if (err) throw err;
                res.send('Success');
            });
        }
        else {
            var newInvasion = Invasions({
                email: req.body.email,
                invasion: req.body.invasion,
                location: req.body.location,
                when: req.body.when,
                confirmed: false
            });
            newInvasion.save(function(err){
                if (err) throw err;
                res.send('Success');
            });
        }
    },
    deleteInvasionById: function(req, res){
        Invasions.findByIdAndRemove(req.body.id, function(err){
            if (err) throw err;
            res.send('Success');
        });
    }
}