import posthog from 'posthog-js';

// Public, write-only project token. Never place a personal API key here.
const PROJECT_TOKEN = 'phc_yKSDWjcCtsozPmKsem2RUbXuYuEg9CH3nQ49qc5HuV8M';
let enabled = false;

export function initAnalytics() {
  if (window.location.hostname !== 'pare-taupe.vercel.app') return;
  try {
    posthog.init(PROJECT_TOKEN, {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      person_profiles: 'never',
      persistence: 'localStorage',
      respect_dnt: true,
    });
    posthog.register({ site_version: 'vercel-pilot', environment: 'production' });
    enabled = true;
  } catch {
    // Analytics must never stop the enquiry form working.
  }
}

export function track(event, properties = {}) {
  if (!enabled) return;
  try { posthog.capture(event, properties); } catch { /* Non-blocking analytics. */ }
}
