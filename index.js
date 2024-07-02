const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucketName = 'api-sqs-lambda-ssm-s3-integration';
  const objectName = 'data.json';

  try {
    const data = await s3.getObject({
      Bucket: bucketName,
      Key: objectName
    }).promise();
    
    const jsonData = JSON.parse(data.Body.toString('utf-8'));
    console.log('Fetched data from S3:', JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Error fetching data from S3:', error);
  }

  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      const { firstname, lastname } = messageBody;
      const country = process.env.country || 'Unknown';
      console.log(`Hello ${firstname} ${lastname}`);
      console.log(`Thank you for reaching out, your request is under process.`);
      console.log(`Please select a Country of choice from "${country}"`);
      console.log(`Regards`);
    } catch (error) {
      console.error('Error processing message:', error);
      console.log('Original message body:', record.body);
    }
  }

  return {};
};
