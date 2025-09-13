import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  
  const supportedSports = ['tennis', 'football', 'basketball', 'bet-of-the-day'];
  if (searchParams.has('date')) {
    const date = searchParams.get('date');
    const sportMatch = pathname.match(/^\/(tennis|football|basketball|bet-of-the-day)$/);
    if (sportMatch) {
      const sport = sportMatch[1];
      const newUrl = new URL(`/${sport}/${date}`, request.url);
      searchParams.delete('date');
      for (const [key, value] of searchParams.entries()) {
        newUrl.searchParams.set(key, value);
      }
      
      return NextResponse.redirect(newUrl, 301);
    }
    const predictionMatch = pathname.match(/^\/(tennis|football|basketball|bet-of-the-day)\/prediction\/(.+)$/);
    if (predictionMatch) {
      const [, sport, slug] = predictionMatch;
      const newUrl = new URL(`/${sport}/${date}/prediction/${slug}`, request.url);
      searchParams.delete('date');
      for (const [key, value] of searchParams.entries()) {
        newUrl.searchParams.set(key, value);
      }
      
      return NextResponse.redirect(newUrl, 301);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(tennis|football|basketball|bet-of-the-day)/:path*'
  ]
};