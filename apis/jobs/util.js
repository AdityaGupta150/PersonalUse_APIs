const skillMap = require('./models/schemas/skillMap')
const profileModel = require('./models/schemas/profile')
const jobModel = require('./models/schemas/job')
const _ = require('underscore')

export async function getRecommendedJobs(userId) {
    let profile = await profileModel.findById(
        userId
        , (err, doc) => {
            if (err) {
                console.log(`Error: ` + err)
            } else {
                if (!doc) {
                    console.log(`No profile found, with {id: ${userId}}`)
                } else {
                    return doc
                }
            }
        });

    let jobsIds = []
    profile.skills.forEach(skill => {
        jobsIds.concat(
            await skillMap.find({
                skillName: skill
            }, (err, docs) => {
                if (err) {
                    console.log(`Error: ` + err)
                } else {
                    if (docs.length === 0) {
                        console.log("No skillMap found for the skill: ", skill)
                    } else {
                        return docs.map((doc) => doc.skillName)
                    }
                }
            })
        )
    });

    jobsIds = _.uniq(_.sortBy(jobsIds), true)

    //Now get all jobs from the received ids
    for (let i = 0; i < jobsIds.length; i++) {
        const element = jobsIds[i];
        
    }
}