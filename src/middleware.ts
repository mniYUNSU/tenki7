import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  // if (
  //   req.nextUrl.pathname.startsWith('/_next') ||
  //   req.nextUrl.pathname.includes('/api/') ||
  //   PUBLIC_FILE.test(req.nextUrl.pathname)
  // ) {
  //   return;
  // }
  // if (req.nextUrl.locale === 'default') {
  //   // 만약 default locale을 수정하고 싶다면 여기의 `en`을 변경하세요.
  //   const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  //   console.log('locale\n\n\n\n\n\n\n', locale);
  //   return NextResponse.redirect(
  //     new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
  //   );
  // }
}
