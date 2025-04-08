'use client'

import * as React from 'react'
import Link from 'next/link';
import { Button } from './ui/button';


const mainNavItems = [    
  { title: "Home", path: "/your-path" },
  { title: "Our Product", path: "/your-path" },
  { title: "About Us", path: "/About" },
  { title: "Contact Us", path: "/your-path" },
];

export default function webNav() {
  return (
    
    <div className="justify-center hidden gap-4 md:flex w-full">
      <div className='flex items-center justify-center flex-nowrap flex-row grow gap-2 mb-2'>
      {mainNavItems.map((item, index) => (
        <Button variant="ghost" key={index} className="font-semibold text-lg rounded-full gap-3 mt-3">
        <Link href={item.path}>{item.title}</Link>
      </Button>
      ))}
          <Button variant={"default"} className="font-semibold text-lg rounded-full gap-3 mt-3">
                <Link href="/">Solar Energy Calculator</Link>
          </Button>
      </div>      
    </div>
  )
}
