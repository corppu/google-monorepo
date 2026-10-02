import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

export interface GoogleRouterPages {
  landing: ReactElement;
  scopes: ReactElement;
  dashboard: ReactElement;
}

/** Expects to be rendered inside a Router whose basename is /spa. */
export const GoogleRouter = ({ pages }: { pages: GoogleRouterPages }) => (
  <Routes>
    <Route path="/google" element={pages.landing} />
    <Route path="/google/scopes" element={pages.scopes} />
    <Route path="/dashboard" element={pages.dashboard} />
    <Route path="*" element={<Navigate to="/google" replace />} />
  </Routes>
);
