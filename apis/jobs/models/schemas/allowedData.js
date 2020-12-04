/** IMPORTANT NOTE - mongoose ->

  var Assignment = mongoose.model('Assignment', { dueDate: Date });
  Assignment.findOne(function (err, doc) {
  doc.dueDate.setMonth(3);
  doc.save(callback); // THIS DOES NOT SAVE YOUR CHANGE

  doc.markModified('dueDate');
  doc.save(callback); // works
})

var Thing = mongoose.model('Thing', schema);
Another example

var m = new Thing;
m.name = 'Statue of Liberty';
m.age = 125;
m.updated = new Date;
m.binary = Buffer.alloc(0);
m.living = false;
m.mixed = { any: { thing: 'i want' } };
m.markModified('mixed');                    //We need to mark before saving, in case of fields of Mixed type
m._someId = new mongoose.Types.ObjectId;
m.array.push(1);                            //[].push automatically marks it modified
m.ofString.push("strings!");
m.ofNumber.unshift(1,2,3,4);
m.ofDates.addToSet(new Date);
m.ofBuffer.pop();
m.ofMixed = [1, [], 'three', { four: 5 }];
m.nested.stuff = 'good';
m.map = new Map([['key', 'value']]);
m.save(callback);
*/

const countryEnCode = {
	India: "IN"
};

const tempCountries = {};
for (const key in countryEnCode) {
	tempCountries[countryEnCode[key]] = key;
}
const countryDeCode = tempCountries;

module.exports = {
	countryEnCode: countryEnCode,
	countryDeCode: countryDeCode,
	allowedJobTypes: {
		I: "Internship",
		F: "FullTime",
		P: "PartTime"
	},
	allowedRoles: {
		A: "Algorithm",
		B: "Backend",
		DA: "Data Analytics",
		DS: "Data Scientist",
		F: "Frontend",
		M: "Marketing",
		S: "System Admin",
		O: "Others"
	},

	// Use it when interacting with user, since this one returns an array of the expanded versions of each role
	getAllowedRoles: function getAllowedRoles (allowedRoles) {
		const tempRoles = [];
		for (const key in allowedRoles) {
			tempRoles.push(allowedRoles[key]);
		}
		return tempRoles;
	}
};
