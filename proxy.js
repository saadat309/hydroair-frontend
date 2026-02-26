import { NextResponse } from 'next/server';

let locales = ['en', 'ru', 'uz'];
let defaultLocale = 'en';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      return;
    }

    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.).*)',
  ],
};
