import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth,req)=>{
  const {userId}=await auth()

  const currentUrl = new URL(req.url)
  const isApiRequest=currentUrl.pathname.startsWith('/api')
  const isAccessingDashboard= currentUrl.pathname === '/home'

    if(isPublicRoute(req)){
    return NextResponse.next()
  }
  if(userId && isPublicApiRoute(req) && !isAccessingDashboard){
    return NextResponse.redirect(new URL('/home',req.url))
  }
  if(!userId){
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL('/sign-in',req.url))
    }
    if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL('/sign-in',req.url))
    }
  }
  return NextResponse.next()
})

const isPublicRoute=createRouteMatcher(['/sign-in','/sign-up','/home','/'])

const isPublicApiRoute=createRouteMatcher(['/api/videos'])

export const config = {
  matcher: [
   "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"
  ],
};