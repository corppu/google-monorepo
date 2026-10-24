import { redirect } from 'react-router';

export function loader() {
  return redirect('/google/dashboard?mock=true');
}

export default function Redirect() {
  return null;
}
