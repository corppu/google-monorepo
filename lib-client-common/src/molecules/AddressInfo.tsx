import type { ReactNode } from 'react';
import './AddressInfo.css';

export const AddressInfo = ({ children }: { children: ReactNode }) => (
  <address className="gm-client-address-info">{children}</address>
);
