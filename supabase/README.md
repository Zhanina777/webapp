# CRYST Supabase setup

The app's `.env` contains the supplied Project URL and browser publishable key. `.env` is ignored by Git. Use `.env.example` when sharing the source, and restart the development server after changing it. Never put a secret/service-role key in a VITE variable.

## Create the tables

1. Open your CRYST project in the Supabase dashboard.
2. Choose SQL Editor, then New query.
3. Paste `migrations/202610290001_cryst.sql` and press Run once.
4. In Table Editor, confirm `profiles` and `recipe_progress` exist and RLS is enabled.

The migration adds new tables; it does not delete existing data. If either table already exists, stop and inspect it rather than deleting it or rerunning modified SQL blindly.

Profiles store a nickname, not age. Each table restricts reads and writes to its authenticated owner. Guests cannot access either table. Supabase Auth manages account credentials separately in auth.users.

## Current implementation status

The official client is configured in `app/supabase-connection/supabase.js`. The hosted tables have been detected; do not rerun the migration. Email/password signup and sign-in use Supabase Auth, with immediate sign-in when Confirm email is disabled. Supabase stores passwords, not our profiles table. The recipe navigation gate uses the Supabase session. Guests can browse every recipe and complete one full project; additional project instructions require an account. Profile redirects guests to account options, and Continue as guest returns to the recipe list. The completion popup sends guests to account options and signed-in users to all recipes. Recipes themselves remain bundled public content; the gate is a UI restriction, while database records are protected by RLS.

Profiles are created on the first authenticated visit, using signup nickname metadata. Finishing a project upserts its completed record against the authenticated owner. Failed saves show a retry message and do not show the successful completion popup. The first full project completed as a guest is stored under `cryst-guest-completed` in localStorage and imported after authentication on the same browser. The local marker is cleared only after a successful cloud write. It is imported into the first account that signs in on that browser. Guest completions from before this feature was added cannot be recovered automatically.

Google, Facebook, and Apple buttons call Supabase OAuth but require provider setup in Supabase and the provider's developer console before they can authenticate. Provider errors are shown rather than creating preview profiles.

## Required dashboard settings

Set Authentication > URL Configuration > Site URL to the actual app URL. Add `http://localhost:5173/create-profile` and, if using port 5174, `http://localhost:5174/create-profile` to Redirect URLs. Add the corresponding production callback when deployed. Use the same browser/origin where the guest project was completed to import it. For the requested simple signup flow, open Authentication > Sign In / Providers > Email, disable Confirm email, and save. Ensure Email signup is enabled. New accounts then receive a session immediately; no email link is required. Existing unconfirmed accounts may still need confirmation by the project owner in the dashboard. Configure custom SMTP before relying on email delivery for a group or production use; Supabase's default mail service is limited.

## Profile and project progress

The profile page supports avatar editing, saved recipes, in-progress recipes, and finished projects. Profile appearance and recipe collections are stored in this browser. Shared helpers in `app/utils/recipeStorage.js` manage saved recipe IDs, the current tutorial step, and locally finished recipe IDs. `useAccount()` provides the signed-in user, profile, loading state, and sign-out action; the display name is `profile.display_name`.

Project completion is also saved to Supabase. `getCompletedProjects()` in `app/supabase-connection/projectProgress.js` can query the signed-in user's completed rows, but the profile currently reads its collection from browser storage. Guest completion is imported after authentication, with a global retry notice if import fails.

## Verification

Run `npm run build` and `npm run typecheck`. Manually verify guest restrictions, guest-completion import, and progress saving. A full signup/sign-in test requires Confirm email to be disabled in the dashboard. Do not share passwords with the developer.

No administrative database access is provided by a publishable key. Run the migration through the Dashboard SQL Editor; don't share the database password or a secret key in chat.
