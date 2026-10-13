import { Outlet } from 'react-router';

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>Dashboard</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
