import { LegalNotice } from '../molecules/LegalNotice';

export const SiteFooter = () => (
  <footer>
    <LegalNotice
      headingId="page-legal-heading"
      heading="Tämän sivun oikeudelliset tiedot"
    >
      Tämän sivun sisältö on suuntaa-antavaa...
    </LegalNotice>
    <LegalNotice
      headingId="app-legal-heading"
      heading="Sovelluksen yleiset oikeudelliset tiedot"
    >
      © 2026 Yritys Oy. Kaikki oikeudet pidätetään.
    </LegalNotice>
  </footer>
);
