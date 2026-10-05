import type { ReactElement } from 'react';
import {
  GenericAuthArticleForm,
  GenericForm,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';
import { GoogleDashboardPage, GoogleRouter } from '@gm/lib-client-google';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { renderPage } from './renderPage';

export interface DashboardData {
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
  selectedCalendarId?: string;
  selectedEventId?: string;
  selectedGroupEmail?: string;
  userinfo?: Userinfo;
}

const noop = () => {};

const loginScript = `
document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var f = e.target;
  var r = await fetch('/api/google/auth/login', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gmail: f.gmail.value, password: f.password.value }) });
  if (r.ok) location.href = '/ssr/google/scopes'; else alert('Login failed');
});`;

const scopesScript = `
document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var scopes = Array.prototype.map.call(document.querySelectorAll('input[type=checkbox]:checked'), function (c) { return c.value; });
  await fetch('/api/google/auth/scopes', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scopes: scopes }) });
  location.href = '/api/google/auth/start?target=ssr';
});`;

const dashboardScript = `
var titleInput = document.getElementById('event-summary-input');
var saveButton = document.querySelector('.gm-google-dashboard-page__form button[type="button"]');
if (titleInput && saveButton) {
  var fieldset = saveButton.closest('fieldset');
  var field = titleInput.closest('.gm-client-field');
  var hintId = titleInput.getAttribute('aria-describedby');
  var errorMessage;
  var showTitleError = function () {
    titleInput.setAttribute('aria-invalid', 'true');
    titleInput.setAttribute('aria-describedby', hintId + ' event-summary-input-error');
    fieldset.classList.add('gm-client-event-update-fieldset--invalid');
    if (!errorMessage) {
      errorMessage = document.createElement('span');
      errorMessage.className = 'gm-client-field__error';
      errorMessage.id = 'event-summary-input-error';
      errorMessage.setAttribute('role', 'alert');
      errorMessage.textContent = 'Event title is required.';
      field.appendChild(errorMessage);
    }
  };
  var clearTitleError = function () {
    titleInput.setAttribute('aria-invalid', 'false');
    titleInput.setAttribute('aria-describedby', hintId);
    fieldset.classList.remove('gm-client-event-update-fieldset--invalid');
    if (errorMessage) {
      errorMessage.remove();
      errorMessage = undefined;
    }
  };
  saveButton.addEventListener('click', function () {
    if (!titleInput.value.trim()) showTitleError();
  });
  titleInput.addEventListener('input', function () {
    if (titleInput.value.trim()) clearTitleError();
  });
}`;

const page = (title: string, body: ReactElement) => (
  <PageTemplate title={title}>{body}</PageTemplate>
);

/** Renders the pages of GoogleRouter (React Router) on the server with ReactDOMServer. */
export function createSSRRenderer(stylesheets: string[] = []) {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/google': 'Sign in with Google',
    '/google/dashboard': 'Dashboard',
    '/google/scopes': 'Choose scopes',
  };
  const scripts: Record<string, string> = {
    '/dashboard': dashboardScript,
    '/google': loginScript,
    '/google/dashboard': dashboardScript,
    '/google/scopes': scopesScript,
  };

  /** `path` is relative to /ssr, e.g. `/google/scopes`. */
  return (path: string, data: DashboardData = {}): string => {
    const pages = {
      dashboard: (
        <GoogleDashboardPage
          calendars={data.calendars}
          events={data.events}
          groups={data.groups}
          onCalendarSelect={noop}
          onEventSelect={noop}
          onGroupSelect={noop}
          onUpdateEvent={async () => {}}
          selectedCalendarId={
            data.selectedCalendarId ?? data.calendars?.items[0]?.id ?? ''
          }
          selectedEventId={data.selectedEventId ?? data.events?.[0]?.id ?? ''}
          selectedGroupEmail={data.selectedGroupEmail ?? ''}
          userinfo={data.userinfo}
        />
      ),
      landing: page(
        'Sign in with Google',
        <GenericAuthArticleForm
          identifierLabel="Gmail"
          identifierName="gmail"
          onSubmit={noop}
        />,
      ),
      scopes: page(
        'Choose scopes',
        <GenericForm>
          <GenericScopesSelectorFieldset
            scopes={GOOGLE_SCOPES}
            selected={MINIMUM_SCOPES}
            onToggle={noop}
          />
          <button type="submit">Authorize</button>
        </GenericForm>,
      ),
    };
    return renderPage(<GoogleRouter pages={pages} />, {
      location: path,
      script: scripts[path],
      stylesheets,
      title: titles[path] ?? 'Google',
    });
  };
}
