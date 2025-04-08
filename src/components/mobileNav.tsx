'use client'

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';

const mobileItems = [
  { title: "Home", path: "/your-path" },
  { title: "Our Product", path: "/your-path" },
  { title: "About Us", path: "/About" },
  { title: "Contact Us", path: "/your-path" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    
    
    <Sheet open={open} onOpenChange={setOpen}>

      {/* This button will trigger open the mobile sheet menu */}
      <div className='items-center justify-center flex flex-nowrap flex-row'>
    
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ml-8 flex-1">          
          <MenuIcon />
        </Button>
      </SheetTrigger>
      </div>
      <SheetContent side="left"> 
        <div className="flex flex-col items-start gap-3">
          {mobileItems.map((item, index) => (
            <Button key={index} variant="ghost" className='font-semibold text-lg rounded-full'
              onClick={() => {
                setOpen(false);
              }}
            > <Link href={item.path}>{item.title}</Link>
            </Button>
          ))}
            <Button variant={"default"} className="font-semibold text-lg rounded-full">
                <Link href="/">Solar Energy Calculator</Link>
            </Button>
        </div>

      </SheetContent>

    </Sheet>
  );
}