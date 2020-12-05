const { Schema, Types, model } = require("mongoose");

/**
 * @brief -> This skillMap collection stores like an array, where the id is the name of the skill  "skillName"
 * 			 and in each document of there is a jobs array, which stores the document id of all jobs that match this skill name,
 * 
 * @notes -> Since the jobs field in the document stores an array of ObjectIds, so to get the jobs documents, you use this id to fetch the job document from database
 */
const skillMap = new Schema({
	_id: { // required... mongoose can't save a document, without an _id field, except subdocuments
		alias: "skillName",
		type: String,
		unique: true,
		required: true
	},
	jobs: {
		type: [Types.ObjectId],
		required: true
	}
}, { _id: false, id: false });

skillMap.virtual("id").get(function () {
	console.log("❕❕ id field of SkillSchema accessed... IT IS DEPRECATED");
	return this._id;
});

module.exports = model("skillMap", skillMap);
