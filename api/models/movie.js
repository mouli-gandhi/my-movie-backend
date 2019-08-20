module.exports  =  (mongoose , Schema) => {
    const Movie =  new Schema({
        name:
        {
          type:String,
          required: true
        },
        release_date: {
          type: Date,
          required: true
        },
        cast:[
            {type: Schema.Types.ObjectId, ref: 'Actor', required:true}
          ],
        plot: {
          type: String,
        },
        poster: {
          type: String,
        }
      }, 
      {
        timestamps: true
      }
    );
    return mongoose.model('Movie', Movie);
};