const Controller = require('../controllers')
module.exports = (app) => {
    app.get('/',(req,res) => {
        res.status(200).json({'message': 'App initialized'});
    })
    app.get('/get-all-actors' , Controller.getAllActors )
    app.get('/get-actor/:id' , Controller.getActorByID )
    app.post('/create-actor', Controller.createActor)

    app.get('/get-all-movies' , Controller.getAllMovies )
    app.get('/get-movie/:id' , Controller.getMovieByID )
    app.post('/create-movie', Controller.createMovie)
    app.put('/update-movie' , Controller.updateMovie )

    app.get('/search-collection', Controller.searchDB)
}