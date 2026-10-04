import type { ReactNode } from 'react';
import { SiteFooter } from '../organisms/SiteFooter';
import { SiteHeader } from '../organisms/SiteHeader';

export const SiteTemplate = ({ children }: { children: ReactNode }) => (
  <>
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </>
);
