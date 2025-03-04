'use client'
import { usePathname } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const BreadCrumbs = () => {
    const pathname = usePathname();
    const [segments, setSegments] = useState<string[] | null>(null);
  
    useEffect(() => {
      setSegments(pathname.split("/").filter(Boolean));
    }, [pathname]);
  
    if (segments === null) return null;
  
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {segments.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbLink className="text-3xl font-mono" href="/">Intellipage</BreadcrumbLink>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-xl" href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                return (
                  <Fragment key={segment}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    )
}

export default BreadCrumbs
