import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const analytics = readFileSync(new URL('../src/analytics.js', import.meta.url), 'utf8')
  .replace("import posthog from 'posthog-js';", '').replaceAll('export function', 'function');

test('production-only analytics with recordings and autocapture disabled', () => {
  for (const hostname of ['localhost', 'pare-preview.vercel.app', 'pare-taupe.vercel.app']) {
    const calls = [];
    const context = vm.createContext({ window: { location: { hostname } }, posthog: {
      init: (...args) => calls.push(args), register() {}, capture: (...args) => calls.push(args),
    } });
    vm.runInContext(analytics + "\ninitAnalytics(); track('form_started');", context);
    assert.equal(calls.length, hostname === 'pare-taupe.vercel.app' ? 2 : 0);
    if (calls.length) {
      assert.equal(calls[0][1].autocapture, false);
      assert.equal(calls[0][1].disable_session_recording, true);
    }
  }
});

test('form success tracking follows confirmed storage and omits contact data', async () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const formCode = main.slice(main.indexOf("const form = document.querySelector('#interest-form');"));
  for (const outcome of ['success', 'rejected', 'offline']) {
    const handlers = {}, events = [];
    const button = {}, status = {};
    const form = { action: 'mock', elements: { spend: { value: '1000-5000' } },
      addEventListener: (name, handler) => { handlers[name] = handler; },
      querySelector: () => ({ ...button, focus() {} }),
    };
    vm.runInNewContext(formCode, {
      document: { querySelector: selector => selector === '#interest-form' ? form : status },
      track: (name, data) => events.push({ name, data }), hydrateIcons() {}, FormData: class {},
      fetch: async () => {
        if (outcome === 'offline') throw new Error('Failed to fetch');
        return { ok: outcome === 'success', json: async () => ({}) };
      },
    });
    handlers.input({ target: { name: 'email' } });
    handlers.input({ target: { name: 'company' } });
    assert.equal(events.length, 1);
    await handlers.submit({ preventDefault() {} });
    assert.equal(events.filter(e => e.name === 'form_submitted').length, outcome === 'success' ? 1 : 0);
    if (outcome === 'success') assert.deepEqual(Object.keys(events[1].data).sort(), ['spend_band', 'spend_period', 'spend_scope']);
  }
});
