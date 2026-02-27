import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { model, event, entry } = body;

    const allLocales = ['en', 'ru', 'uz'];
    
    allLocales.forEach(lang => {
      revalidatePath(`/${lang}`);
      revalidatePath(`/${lang}/products`);
      revalidatePath(`/${lang}/products/${entry?.slug || ''}`);
      revalidatePath(`/${lang}/about`);
      revalidatePath(`/${lang}/contact`);
      revalidatePath(`/${lang}/cart`);
      revalidatePath(`/${lang}/checkout`);
      revalidatePath(`/${lang}/orders`);
    });
    
    revalidatePath('/');
    revalidatePath('/en');
    revalidatePath('/ru');
    revalidatePath('/uz');

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
  return NextResponse.json({ message: 'Revalidation endpoint - POST with {"model": "product", "event": "entry.*"}' });
}
