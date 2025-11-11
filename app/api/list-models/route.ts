import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: true, 
        status: response.status,
        details: errorText 
      });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      models: data.models 
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: true, 
      message: error.message 
    });
  }
}