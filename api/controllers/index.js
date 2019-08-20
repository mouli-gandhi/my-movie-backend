const models = require("../models"),
  Actor = models.Actor,
  Movie = models.Movie;
const sanitizer = require('sanitizer')

function sanitizeInput(text , input_type) {
    if(input_type === 'NAME'){
        const letters = /^[A-Za-z ]+$/;
        if(!(letters.test(text)))
            text = '';
        else
            text = sanitizer.sanitize(text);
        return text;
    }
    else 
        return sanitizer.sanitize(text);
}

module.exports = {

  getAllActors: (req, res) => {
    let name = req.query.name ? req.query.name  : '';
    name = sanitizeInput(name , 'NAME')
    Actor.find({name: { $regex: '.*' + name + '.*' , $options: 'i'} }, (error, data) => {
      if (error) res.status(400).json({ message: error });
      else res.status(200).json({ message: data });
    });
  },

  getActorByID: (req, res) => {
    if (req.params.id) {
        let id = sanitizeInput(req.params.id ,'OTHER' )
      Actor.findById(id)
        .exec()
        .then(function(actor) {
          Movie.find({ cast: { $elemMatch: { $eq: actor._id } } }, "name")
            .exec()
            .then(function(movies) {
              res.status(200).json({ message: [actor, movies] });
            });
        }).catch(err => {
            res.status(400).json({ message: err });
        });
    } else res.status(400).json({ message: "No id given" });
  },

  createActor: (req, res) => {
    if (req.body) {
      let actor = req.body;
      let obj = {
        name: sanitizeInput(actor.name ,'OTHER' ),
        sex: sanitizeInput(actor.sex ,'NAME' )
      };
      Object.assign(obj , 
        actor.bio && {bio : sanitizeInput(actor.bio ,'OTHER' )},
        actor.dob && {dob : new Date(actor.dob)});
      let insertObj = new Actor(obj);
      insertObj.save(function(error, data) {
        if (error) {
          res.status(400).json({ message: error });
        } else {
          res.status(200).json({ message: data });
        }
      });
    } else res.status(400).json({ message: "No Form Data" });
  },

  getAllMovies: (req, res) => {
    let start = !isNaN(Number(req.query.start)) ? Number(req.query.start) : 0;
    Movie.find({}, null, {
      skip: start,
      limit: 10,
      sort: { release_date: -1 }
    })
      .populate("cast", "name")
      .exec((err, movies) => {
        if (err) res.status(400).json({ message: err });
        else res.status(200).json({ message: movies });
      });
  },

  getMovieByID: (req, res) => {
    if (req.params.id) {
    let id = sanitizeInput(req.params.id ,'OTHER' )
      Movie.findById(id)
        .populate("cast", "name")
        .exec((err, movies) => {
          if (err) 
            res.status(400).json({ message: err });
          else 
            res.status(200).json({ message: movies });
        });
    } else res.status(400).json({ message: "No id given" });
  },

  createMovie: (req, res) => {
    if (req.body) {
      let movie = req.body;
      let obj = {
        name: sanitizeInput(movie.name ,'OTHER' ),
        cast: Array.isArray(movie.cast) ? movie.cast : [],
        release_date: new Date(movie.release_date)
      };
      Object.assign(obj , 
        movie.plot && {plot : sanitizeInput(movie.plot ,'OTHER' )},
        movie.poster && {poster : movie.poster});
      let insertObj = new Movie(obj);
      insertObj.save(function(error, data) {
        if (error) {
          res.status(400).json({ message: error });
        } else {
          res.status(200).json({ message: data });
        }
      });
    } else res.status(400).json({ message: "No Form Data" });
  },

  updateMovie : (req , res) => {
      if(req.body){
            let id = req.body.id;
            if(req.body.id){
                delete req.body.id;
                let updateObj = req.body;
                Object.assign(updateObj , 
                    updateObj.name && {name : sanitizeInput(updateObj.name ,'OTHER' )},
                    updateObj.release_date && {release_date : new Date(updateObj.release_date) },
                    updateObj.cast && {cast : Array.isArray(updateObj.cast) ? updateObj.cast : [] },
                    updateObj.plot && {plot : sanitizeInput(updateObj.plot ,'OTHER' )},
                    updateObj.poster && {poster : updateObj.poster});
                Movie.updateOne({_id : id}, { $set: updateObj }).
                then((data) => {
                    if(data.nModified){
                        Movie.findById(id)
                        .exec()
                        .then(function(movie) {
                            res.status(200).json({ message: movie });
                        });
                    }
                    else
                    res.status(400).json({ message: "No field is updated" });
                })
                .catch(err=> {
                    res.status(400).json({ message: err });   
                }) 
            }
            else res.status(400).json({ message: "No ID" });
      }
      else res.status(400).json({ message: "No Form Data" });
  },

  searchDB: (req, res) => {
    let name = req.query.name ? sanitizeInput(req.query.name , 'NAME') : '';
    Actor.find({name: { $regex: '.*' + name + '.*' , $options: 'i'} })
    .exec()
    .then(actors => {
        Movie.find({name: { $regex: '.*' + name + '.*' , $options: 'i'} })
        .exec()
        .then(movies => {
            res.status(200).json({ message: [movies, actors] });
        }).catch(err=> {
            res.status(400).json({ message: err });   
        })
    }).catch(err=> {
        res.status(400).json({ message: err });   
    })
  },

};
