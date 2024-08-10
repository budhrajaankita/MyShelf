// app/api/recognize/route.js

import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';

const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
  );

console.log(credentials)
  
 
export async function POST(request) {
  const { image } = await request.json();

  if (!image) {
    return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
  }

  try {
    // const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    // const credjson = JSON.stringify(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    // const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(credjson);
    console.log("here")
    const client = new vision.ImageAnnotatorClient({
        credentials,
        projectId: credentials.project_id
    });
    console.log(client)
    //   keyFilename: 'path/to/your-service-account-file.json', // Replace with your JSON key file path
    // });

    const [result] = await client.labelDetection(Buffer.from(image.split(',')[1], 'base64'));
    const labels = result.labelAnnotations;
    // console.log("server recognize");
    console.log(labels);



    return NextResponse.json({ labels: labels.map(label => label.description) });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}