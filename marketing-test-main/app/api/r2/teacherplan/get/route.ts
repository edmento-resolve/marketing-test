import { BUCKET_NAME, r2Client } from '@/lib/r2.config/r2';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    const responseData = await request.json();
    const { community_Url } = responseData;

    if (!community_Url) {
        return NextResponse.json({ success: false, message: 'Community URL is required' }, { status: 400 });
    }
    try {
        const key = community_Url;
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await r2Client.send(command);

        if (!response.Body) {
            return NextResponse.json({ success: false, message: 'No data found' }, { status: 404 });
        }
        const text = await response.Body.transformToString();
        const data = JSON.parse(text);
        return NextResponse.json({ success: true, message: 'Community URL fetched successfully', data }, { status: 200 });
    } catch (error: any) {
        console.error('R2 Get Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}