// app/api/recognize/route.js

import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';

const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
  );
  
 
export async function POST(request) {
  const { image } = await request.json();

  if (!image) {
    return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
  }

  try {
    const client = new vision.ImageAnnotatorClient({
        credentials,
        projectId: credentials.project_id
    });
    // console.log(client)

    const [result] = await client.objectLocalization({
        image: { content: image.split(',')[1] },
      });
  
      const objects = result.localizedObjectAnnotations;
      console.log('Objects:', objects);
      console.log(objects.map(object=> object.name));
  
      return NextResponse.json({ objects: objects.map(object => object.name) });

    // const [result] = await client.labelDetection(Buffer.from(image.split(',')[1], 'base64'));
    // const labels = result.labelAnnotations;
    // // console.log("server recognize");
    // console.log(labels);



    // return NextResponse.json({ labels: labels.map(label => label.description) });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}