function App() {
  return (
    <>
      <header>
        <h1>Application main heading</h1>

        <nav aria-label="Navigation to Atomic Design Pages">
          <ul>
            <li>
              <a href="/google/groups">Google Groups Integration Page</a>
            </li>
            <li>
              <a href="/google/calendars">Google Calendars Integration Page</a>
            </li>
            <li>
              <a href="/google/credentials">Google Credentials</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <h2>Google Calendars</h2>
        <nav aria-label="Anchor navigation">
          <ul>
            <li>
              <a href="#artikkeli-1">Osa 1: Johdanto</a>
            </li>
            <li>
              <a href="#artikkeli-2">Osa 2: Syventävä tieto</a>
            </li>
          </ul>
        </nav>

        <article id="artikkeli-1">
          <h2>Osa 1: Johdanto</h2>
          <p>Tähän tulee ensimmäisen artikkelin teksti...</p>
        </article>

        <article id="artikkeli-2">
          <h2>Osa 2: Syventävä tieto</h2>
          <p>Tähän tulee toisen artikkelin teksti ja yksityiskohdat...</p>
        </article>
      </main>

      <footer>
        <section aria-labelledby="page-legal-heading">
          <h2 id="page-legal-heading" className="visually-hidden">
            Tämän sivun oikeudelliset tiedot
          </h2>
          <p>Tämän sivun sisältö on suuntaa-antavaa...</p>
        </section>

        <section aria-labelledby="app-legal-heading">
          <h2 id="app-legal-heading" className="visually-hidden">
            Sovelluksen yleiset oikeudelliset tiedot
          </h2>
          <p>© 2026 Yritys Oy. Kaikki oikeudet pidätetään.</p>
        </section>
      </footer>
    </>
  );
}

export default App;
