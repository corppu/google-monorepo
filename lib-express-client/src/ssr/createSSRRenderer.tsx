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
  GooglePublicContactInfo,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { renderPage } from './renderPage';

export interface DashboardData {
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
  publicContactInfo?: GooglePublicContactInfo;
  publicContactInfoError?: string;
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
document.querySelectorAll('input[name="google-event"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('createEvent');
    currentUrl.searchParams.delete('eventId');
    if (radio.value === '__create_event__') {
      currentUrl.searchParams.set('createEvent', 'true');
    } else {
      currentUrl.searchParams.set('eventId', radio.value);
    }
    window.location.assign(currentUrl.toString());
  });
});
var titleInput = document.querySelector('.gm-google-dashboard-page__form input[id$="-summary-input"]');
if (titleInput) {
  var fieldset = titleInput.closest('fieldset');
  var saveButton = fieldset.querySelector('button[type="button"]');
  var field = titleInput.closest('.gm-client-field');
  var hintId = titleInput.getAttribute('aria-describedby');
  var errorId = titleInput.id + '-error';
  var errorMessage;
  var showTitleError = function () {
    titleInput.setAttribute('aria-invalid', 'true');
    titleInput.setAttribute('aria-describedby', hintId + ' ' + errorId);
    fieldset.classList.add('gm-client-event-editor-fieldset--invalid');
    if (!errorMessage) {
      errorMessage = document.createElement('span');
      errorMessage.className = 'gm-client-field__error';
      errorMessage.id = errorId;
      errorMessage.setAttribute('role', 'alert');
      errorMessage.textContent = 'Event title is required.';
      field.appendChild(errorMessage);
    }
  };
  var clearTitleError = function () {
    titleInput.setAttribute('aria-invalid', 'false');
    titleInput.setAttribute('aria-describedby', hintId);
    fieldset.classList.remove('gm-client-event-editor-fieldset--invalid');
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
  var startInput = document.getElementById('create-event-start-input');
  var endInput = document.getElementById('create-event-end-input');
  if (startInput && endInput) {
    var setDateError = function (input, message) {
      var errorId = input.id + '-error';
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', input.id + '-hint ' + errorId);
      var error = document.getElementById(errorId);
      if (!error) {
        error = document.createElement('span');
        error.className = 'gm-client-field__error';
        error.id = errorId;
        error.setAttribute('role', 'alert');
        input.closest('.gm-client-field').appendChild(error);
      }
      error.textContent = message;
    };
    var clearDateError = function (input) {
      input.setAttribute('aria-invalid', 'false');
      input.setAttribute('aria-describedby', input.id + '-hint');
      var error = document.getElementById(input.id + '-error');
      if (error) error.remove();
    };
    saveButton.addEventListener('click', function () {
      var startTime = Date.parse(startInput.value);
      var endTime = Date.parse(endInput.value);
      if (Number.isNaN(startTime)) {
        setDateError(startInput, 'Start date and time is required.');
      } else if (endTime <= startTime || Number.isNaN(endTime)) {
        setDateError(endInput, 'End date and time must be after the start.');
      }
    });
    startInput.addEventListener('input', function () {
      if (!Number.isNaN(Date.parse(startInput.value))) clearDateError(startInput);
    });
    endInput.addEventListener('input', function () {
      if (!Number.isNaN(Date.parse(endInput.value))) clearDateError(endInput);
    });
  }
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
          contactInfo={data.publicContactInfo}
          contactInfoError={data.publicContactInfoError}
          events={data.events}
          groups={data.groups}
          onCalendarSelect={noop}
          onEventSelect={noop}
          onGroupSelect={noop}
          onSaveEvent={async () => {}}
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
