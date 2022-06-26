import { S3 } from 'aws-sdk'

const s3 = new S3({
   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
 })
 
//  app.get('/upload', async (req, res) => {
//    const imgUri = 'https://static.wikia.nocookie.net/armaea/images/4/48/Cassius_Aeremaeus.jpg'
//    const response = await fetch(imgUri)
//    const blob = Buffer.from(await response.arrayBuffer())
//    const uploaded = await s3.upload({
//      Bucket: process.env.AWS_S3_BUCKET_NAME,
//      Key: 'Cassius_Aeremaeus.jpg',
//      Body: blob
//    }).promise()
//    console.log(uploaded)
 
//    //https://flaviocopes.com/node-aws-s3-upload-image/
//  })
 
//  app.get('/download', async (req, res) => {
//    const Key = 'Cassius_Aeremaeus.jpg'
//    const response = await s3.getObject({
//      Bucket: process.env.AWS_S3_BUCKET_NAME,
//      Key
//    }).promise()
//    res.attachment(Key)
//    res.send(response.Body)
//  })