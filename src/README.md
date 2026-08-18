# Website source layout

This was one 2,806-line `main.jsx` holding twenty-three components, the API
constants, the CSV export and every page on the site. Finding anything meant
scrolling, and two people could not work on it at once without colliding. It is
split by *what a file is for*:

```
src/
  main.jsx                     mounts <App />, nothing else
  App.jsx                      the route table, and the page shell
  styles.css

  lib/
    site.js                    contact details, URLs, nav items
    screenshots.js             the screenshot galleries, read from assets/

  components/                  used by more than one feature
    Header.jsx  Footer.jsx  Reveal.jsx  StarRating.jsx  LegalLayout.jsx

  features/
    marketing/                 the public site
      HomePage.jsx  PosterShowcase.jsx
      ReviewsSection.jsx  ScreenshotsSection.jsx

    admin/                     the owner's panel, behind the panel token
      AdminDashboardPage.jsx   users, subscriptions, notifications
      AdminPaymentsPage.jsx    manual payment approvals
      components/              charts and cells used by the dashboard
        DashTrendChart.jsx     the site-wide trend
        DashBar.jsx
        ProjectCountCell.jsx   estimation / fabrication / glass, per user
        ActivityChart.jsx      one user's twelve months
        UserActivityPanel.jsx  the drawer behind the "View" button
      lib/
        format.js              dashDate, dashAgo, dashNumber, plan rows
        csv.js                 the user export

    legal/                     pages Google Play and the payment gateway
      PrivacyPolicy.jsx  RefundPolicy.jsx  DeleteAccount.jsx
      SupportPage.jsx  AboutPage.jsx
```

## Where to put a new thing

- A new page → `features/<area>/`, and a route in `App.jsx`.
- Something two features both need → `components/` or `lib/`.
- Anything only the admin panel uses → keep it under `features/admin/`, so the
  public bundle is not carrying the owner's tooling around.

## Two rules worth keeping

**Charts are hand-drawn SVG, on purpose.** The dashboard's charts are a few
dozen data points each. A charting library would cost more in bundle size than
it saves in code, on a site whose visitors are mostly on phone data.

**The site-wide trend and the per-user activity chart are different things.**
`DashTrendChart` is everyone together; `ActivityChart` is one user's own
record. Do not feed one the other's data.
