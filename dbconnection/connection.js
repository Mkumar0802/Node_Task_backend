const mongoose = require("mongoose");

exports.connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://mkumar0802:soFihfwelSa7egqE@erp.khd5stn.mongodb.net/?retryWrites=true&w=majority&appName=ERP', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000 // This option doesn't belong here
        });
        console.log("MongoDB connected");
    } catch(err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process if there's an error
    }
}
