const AWS = require("aws-sdk");
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

AWS.config.update({ region: process.env.AWS_CONFIG_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18"
});

module.exports.createStaff = (event, context, callback) => {

    const name = event.request.userAttributes.name;
    const phone_number = event.request.userAttributes.phone_number;
    const id = event.userName;
    const role = event.request.userAttributes['custom:role'];
    const userPoolId= process.env['USERPOOLID'];

    const add_group_params = {
        GroupName: role,
        UserPoolId: userPoolId,
        Username: id
    };

    // Add Role to staff
    cognitoidentityserviceprovider.adminAddUserToGroup(add_group_params, function (
        err,
        data
    ) {
        if (err) {
            console.log('Role creation error ', err);
            context.done(null, err);
        }
        else {
            console.log('successfull role added');
        }
    });

    // Insert user into table
    const params = {
        TableName: process.env.STAFF_TABLE_NAME,
        Item: {
            'id': {S: id},
            'name': {S: name},
            'phone': { S: phone_number },
            'role': { S: role }
        }
    };

    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log(err, "database");
            context.done(null, err);
        } else {
            console.log(data, "DATA");
            context.done(null, event);
        }

    })
}