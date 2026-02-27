import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { model, entry, event } = body;

    const allLocales = ['en', 'ru', 'uz'];
    
    allLocales.forEach(lang => {
      revalidatePath(`/${lang}`);
      revalidatePath(`/${lang}/products`);
      revalidatePath(`/${lang}/about`);
      revalidatePath(`/${lang}/contact`);
    });
    
    revalidatePath('/');
    revalidatePath('/en');
    revalidatePath('/ru');
    revalidatePath('/uz');
    revalidatePath('/en/products');
    revalidatePath('/ru/products');
    revalidatePath('/uz/products');
    revalidatePath('/en/about');
    revalidatePath('/ru/about');
    revalidatePath('/uz/about');
    revalidatePath('/en/contact');
    revalidatePath('/ru/contact');
    revalidatePath('/uz/contact');

    if (model) {
      revalidateTag(`strapi-${model}`);
    }

    return NextResponse.json({ 
      revalidated: true, 
      model,
      event,
      timestamp: Date.now() 
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Revalidation endpoint - POST with {"model": "product", "entry": {...}}' });
}
