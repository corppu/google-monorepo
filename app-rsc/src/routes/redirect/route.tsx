import { redirect } from 'react-router';

export function loader() {
  return redirect('/dashboard?mock=true');
}

export default function Redirect() {
  return null;
}
