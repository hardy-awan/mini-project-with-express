const Credits = require('../../models/Credits.model');
const Subject = require('../../models/Subjects.model');
const { CustomeMessage } = require('../../helpers/customeMessage');
class ResultsCredistController {
    constructor(req, res) {

        this.req = req;
        this.res = res;
        this.msg = new CustomeMessage(res);
    }
    async Controller() {

        const { req, res, msg } = this;

        // result all data from credits model
        await Credits.find().select('subject_id lecture_id score_uas score_uts score_final').populate('user_id', 'name username email gender').lean(true).then(async result => {

            if (!result) {

                msg.error('error', 404, {

                    response: {

                        status: 'error',
                        code: 404,
                        method: req.method,
                        url: req.originalUrl,
                        message: 'Oops..data not found in database or deleted'
                    }
                });

            } else {

                // result all data from subject model

                const subject = await Subject.findOne({ creditsId: result[0]['creditsId'] }).select('name code semester sks').lean(true);

                msg.success('success', 200, {

                    response: {

                        status: 'success',
                        code: res.statusCode,
                        method: req.method,
                        url: req.originalUrl,
                        message: 'Yeah..data already to use',
                        data: { results: result.concat(subject) }
                    }
                });
            }
        }).catch(err => {

            msg.error('error', 500, {

                response: {

                    status: 'error',
                    code: 500,
                    method: req.method,
                    url: req.originalUrl,
                    message: `Internal server error ${err}`
                }
            });
        });
    }
}

module.exports = { ResultsCredistController };