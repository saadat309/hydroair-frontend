import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { model, entry } = body;

    if (model && entry?.slug) {
      revalidatePath('/[lang]', 'page');
      revalidatePath('/');
      revalidatePath('/en');
      revalidatePath('/ru');
      revalidatePath('/uz');
    }

    if (model === 'product' || model === 'global-setting') {
      revalidatePath('/[lang]', 'page');
      revalidatePath('/');
      revalidatePath('/en');
      revalidatePath('/ru');
      revalidatePath('/uz');
      revalidatePath('/[lang]/products');
      revalidatePath('/en/products');
      revalidatePath('/ru/products');
      revalidatePath('/uz/products');
    }

    return NextResponse.json({ 
      revalidated: true, 
      model,
      timestamp: Date.now() 
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Revalidation endpoint' });
}
