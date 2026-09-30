## Running the Tests

Run the full suite (all browsers):
```bash
npx playwright test
```

Run a specific browser project:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=edge
```

Run a specific test file:
```bash
npx playwright test tests/UI-Kariera.spec.ts
npx playwright test tests/responsive.spec.ts
```

## Reporting

This project generates multiple report formats on every run:

| Report | Location | Purpose |
|---|---|---|
| HTML report | `playwright-report/` | Visual, interactive report — pass/fail per test/browser, embedded screenshots, traces |
| JSON report | `test-results/results.json` | Machine-readable summary, useful for CI dashboards or custom tooling |
| Console output | terminal (live) | Real-time pass/fail as tests run |

### Viewing the HTML report

```bash
npx playwright show-report
```
Opens the last run's report in your browser. Failed tests show an attached screenshot, and a "trace" link for deeper inspection.

### Screenshots on failure

Failing tests automatically capture a screenshot at the point of failure (`screenshot: 'only-on-failure'` in `playwright.config.ts`). These are embedded directly in the HTML report and also saved as raw files under `test-results/<test-name>/test-failed-1.png`.

### Video on failure

Failing tests also retain a full video recording of the run (`video: 'retain-on-failure'`), saved alongside the screenshot in `test-results/`.

### Traces (detailed logs)

On a test's first retry, Playwright records a full trace — network requests, console logs, DOM snapshots, and a step-by-step action timeline. View any trace with:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```
Or drag-and-drop the `.zip` file into [trace.playwright.dev](https://trace.playwright.dev).

### CI reports

On every push/PR, GitHub Actions runs the full suite and uploads two artifacts (available under the workflow run's **Summary** tab on GitHub):
- **`playwright-report`** — the rendered HTML report
- **`test-results`** — raw screenshots, videos, and trace files for any failures

Download these from the Actions run page to inspect a CI failure exactly as if it happened locally.

## Known Limitations

- The Google Search step in `UI-Kariera.spec.ts` is skipped on Firefox and WebKit, as Google's anti-bot detection reliably blocks non-Chromium browser automation regardless of implementation. This step is fully verified on Chrome and Edge; all other tests run and pass across all four browsers.