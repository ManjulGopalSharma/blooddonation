import CampRegistration from "../Models/RegisterCamp.js";

export const getCampDonors = async (req,res) => {

try{

const { campId } = req.body;

const donors = await CampRegistration.find({
campId: campId
});

res.status(200).json({
donors
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Error fetching donors"
});

}

};