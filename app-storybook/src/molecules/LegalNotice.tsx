import { VisuallyHiddenHeading } from '../atoms/VisuallyHiddenHeading';

export const LegalNotice = ({
  children,
  heading,
  headingId,
}: {
  children: string;
  heading: string;
  headingId: string;
}) => (
  <section aria-labelledby={headingId}>
    <VisuallyHiddenHeading id={headingId}>{heading}</VisuallyHiddenHeading>
    <p>{children}</p>
  </section>
);
