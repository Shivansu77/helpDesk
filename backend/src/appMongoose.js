require('dotenv').config();
const {connect} = require('mongoose');
async function connectDb(){
    try{
        await connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log('db connected');
    }catch(error){
        console.log('MongoDB connection failed:', error); 
    }
}
connectDb();

//shivansubisht77_db_user
//jJvnEUNMzc9LCiLc