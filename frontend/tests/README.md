
# Playwright Tests for APT Manager

This directory contains end-to-end tests for the APT Manager application using Playwright.

## Running Tests

To run the tests, you'll need to first install Playwright using npm:

```bash
npx playwright install
```

Then you can run the tests with:

```bash
npx playwright test
```

## Test Structure

The tests are organized by page/feature:

- `setup.spec.ts`: Tests basic application loading and structure
- `navigation.spec.ts`: Tests navigation between all major pages
- `dashboard.spec.ts`: Tests the dashboard page functionality
- `meters.spec.ts`: Tests the meters page and filtering
- `import.spec.ts`: Tests the import functionality
- `import-guides.spec.ts`: Tests the import guides page
- `export.spec.ts`: Tests the export functionality
- `imprint.spec.ts`: Tests the imprint page

## Viewing Test Results

After running the tests, you can view the HTML report with:

```bash
npx playwright show-report
```

## CI Integration

These tests can be integrated into CI pipelines by adding the appropriate scripts to your CI configuration.
