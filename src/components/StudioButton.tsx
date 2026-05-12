import React from 'react';
import { cn } from '../utils/cn';

interface StudioButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function StudioButton({ label, href, onClick, className }: StudioButtonProps) {
  const content = (
    <div className={cn(
      "group relative inline-flex items-center gap-4 py-2 cursor-pointer transition-opacity hover:opacity-70",
      className
    )}>
      {/* Icon Arrow (from SVG path) */}
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <path 
          d="M3.58497 2.64771L15.1721 14.2348C15.346 14.4622 15.5136 14.7478 15.6243 14.9423C15.6455 14.9835 15.6713 15.0124 15.7025 15.0285C15.7294 15.0425 15.7738 15.053 15.8305 15.0238L15.8381 15.0198L15.8727 14.9937C15.9049 14.9614 15.9328 14.9029 15.8833 14.8066C15.8063 14.6569 15.663 14.3783 15.6122 14.1431C15.4605 13.4372 15.3301 10.249 15.6334 8.1115L17.2095 8.3423C16.7415 11.5926 17.0436 14.6572 18.0835 17.2113L17.0208 18.274C14.467 17.2339 11.4022 16.9319 8.15186 17.4L7.92081 15.8241C10.0583 15.5208 13.2467 15.651 13.9526 15.8027C14.1869 15.853 14.4658 15.9965 14.6157 16.0733C14.7129 16.1232 14.7712 16.0952 14.8035 16.0629L14.8095 16.0569L14.8336 16.0208C14.8627 15.964 14.8523 15.9196 14.8383 15.8927C14.8222 15.8615 14.7932 15.8357 14.75 15.8134C14.558 15.7042 14.2729 15.5372 14.039 15.3576L2.45703 3.7757L3.58497 2.64771Z" 
          fill="currentColor"
        />
      </svg>

      {/* Label Text */}
      <span className="text-[14px] md:text-[16px] font-presura font-medium uppercase tracking-[0.2em] leading-none mb-[2px]">
        {label}
      </span>

      {/* Underline (from SVG rect) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-current scale-x-100 origin-left transition-transform duration-500 ease-out group-hover:scale-x-0" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-current scale-x-0 origin-right transition-transform duration-500 ease-out group-hover:scale-x-100" />
    </div>
  );

  if (href) {
    return <a href={href} className="no-underline text-inherit">{content}</a>;
  }

  return <button onClick={onClick} className="bg-transparent border-0 p-0 text-inherit cursor-pointer text-left">{content}</button>;
}
