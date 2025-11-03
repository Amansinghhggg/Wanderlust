const mongoose = require('mongoose');
const Listing = require('../MODELS/listing');
const { data } = require('../init/data');

async function main() {
   mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("Mongo Connection Open"))
.catch(err => console.log(err));


const init = async () => {
   let result = await Listing.updateMany({}, { $set: { owner: "6907aea4273ddd08817a7ba3" } });
    console.log(result);
};
init();
