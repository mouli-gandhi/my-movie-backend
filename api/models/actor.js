module.exports  = (mongoose , Schema) => {
    const Actor =  new Schema({
        name:
        {
          type:String,
          required: true
        },
        sex:
        {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Others'],
        },
        dob: {
          type: Date,
        },
        bio: {
          type: String,
        }
      }, 
      {
        timestamps: true
      }
    );
    return mongoose.model('Actor', Actor);
};