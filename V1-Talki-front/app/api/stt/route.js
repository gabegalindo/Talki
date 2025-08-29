import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Flask 백엔드로 요청 전달
    const flaskResponse = await fetch('http://localhost:8000/api/stt', {
      method: 'POST',
      body: formData,
    });

    if (!flaskResponse.ok) {
      throw new Error('음성 인식에 실패했습니다.');
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('STT API 오류:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
