# Courir Alsace

Courir Alsace est un SaaS multi‑tenant (hub + sites organisateurs) construit sur une stack **Next.js App Router / Payload 3.x / PostgreSQL** et un stockage médias compatible S3 (MinIO en local).

## Architecture

- **Next.js** (React 19) pour le site public, le hub `/`, la liste globalisée des événements (`/events`) et les pages dynamiques tenant (`/[...slug]`).
- **Payload CMS** expose l’admin et gère les collections `Tenants`, `Users`, `Events`, `Pages`, `Media` avec des ACL fines basées sur les rôles/tenants.
- **Multi-tenant** : le middleware Next.js lit `Host`, résout le tenant via `src/utilities/resolveTenant.ts` et injecte les entêtes `x-courir-tenant-*` que Payload utilise côté admin pour filtrer les données.
- **Stockage média** ciblé : le bucket S3/MinIO (voir variables).

## Démarrage local

1. **Services d’infra**
   ```bash
   docker compose up -d
   ```
   Cela lance Postgres (`couriralsace` / `couriralsace`) et MinIO (`minioadmin` / `minioadmin`).

2. **Créer la base**
   ```bash
   docker exec -it couriralsace-postgres createdb -U couriralsace couriralsace
   ```
   Postgres écoute sur le port **5433** (mappé sur le `5432` interne).

3. **Configurer MinIO**
   - Accède à `http://localhost:9001`, crée un bucket `couriralsace`.
   - Note les identifiants qui vont dans `S3_ACCESS_KEY` / `S3_SECRET_KEY`.

4. **Variables d’environnement**
   Copie `.env.example` et mets les valeurs suivantes :
   ```ini
   DATABASE_URL=postgres://couriralsace:couriralsace@127.0.0.1:5433/couriralsace
   PAYLOAD_SECRET=un-secret-très-long
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   CRON_SECRET=secret-cron
   PREVIEW_SECRET=secret-preview

   S3_ENDPOINT=http://localhost:9000
   S3_REGION=eu-west-1
   S3_BUCKET=couriralsace
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=minioadmin
   S3_FORCE_PATH_STYLE=true
   ```

5. **Installer puis lancer**
   ```bash
   npm install
   npm run dev
   ```
   `npm run dev` démarre Payload et Next.js en parallèle (concurrently). Next bascule sur `3001` si `3000` est occupé.

6. **Multi-domaine local**
   Ajoute ces lignes dans `/etc/hosts` (macOS/Linux / WSL) :
   ```
   127.0.0.1 couriralsace.localhost
   127.0.0.1 trail.localhost
   127.0.0.1 course.localhost
   ```
   Chaque sous-domaine résout un tenant grâce au champ `Tenants.domains.host`. Ouvre ensuite `trail.localhost:3000` pour l’admin + site du tenant.

7. **Vérifier le tenant résolu**
   - `GET /api/tenant-debug` montre l’hôte et son tenant (utile pour confirmer que `resolveTenant` fonctionne).

## Payload — règles métier

- **Collections principales**
  - `Tenants` : slug + domaines + branding + couleurs/réseaux.
  - `Users` : rôle global (super-admin) + liste `tenantMemberships` (tenant + rôle `admin`/`organizer`/`viewer`).
  - `Events` / `Pages` : chaque doc référence `tenant` et les accès CRUD passent par `requireTenantRole`.
  - `Media` : listes de médias partagées, upload local + S3.
- **Accès**
  - `requireTenantRole` valide que l’utilisateur connecté a le rôle requis **pour le tenant actif** (via header `x-courir-tenant-id` ou champ `tenant`).
  - `assignTenantFromUser` assigne le `tenant` par défaut à partir des memberships pour éviter toute saisie manuelle.
  - `Tenants` est traduit en français (`Organisateurs`, `Nom de l’organisateur`, etc.) pour l’admin.
- **Traductions**
  - L’i18n front et admin utilise `@payloadcms/translations` et le fallback `fr`.

## Next.js — routage multi-tenant

- `middleware.ts` (racine) trim les ports, résout le tenant via `resolveTenant(host)` et expose les en-têtes `x-courir-tenant-*`.
- `resolveTenant` cherche le domaine exact ou le sous-domaine (ex: `trail.localhost` → tenant) et met un cache mémoire pour éviter les requêtes répétées.
- Les pages server :
  - `/` et `/events` affichent le hub global (aucun tenant) via `tenantId` null.
  - `/[...slug]` lance `generateMetadata` + `Page` qui appellent `resolveTenant` (via `headers`) et filtrent les pages/series par `tenantId`.
  - Si la page cible un tenant différent ou n’existe pas : on déclenche `PayloadRedirects` pour renvoyer un 404 ou rediriger.
- Les composants React se basent sur `draftMode`, `getPayload` et la configuration `payload-types` générée (`npm run generate:types` après modifications schema).

## Environnement & secrets

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | chaîne PostgreSQL (voir docker compose). |
| `PAYLOAD_SECRET` | chiffrement JWT/CSRF. |
| `NEXT_PUBLIC_SERVER_URL` | URL racine (utilisée pour `generateURL`). |
| `CRON_SECRET`, `PREVIEW_SECRET` | protections des endpoints / preview. |
| `S3_*` | endpoint, bucket et clés MinIO/S3. `S3_FORCE_PATH_STYLE=true` est nécessaire pour MinIO. |

## Checklist MVP (7 jours)

1. **Jour 1** — Infrastructure : Postgres + MinIO via Docker, env, base `couriralsace`.
2. **Jour 2** — Collections Payload : `Tenants`, `Users`, `Events`, `Pages`, `Media` + ACL (labels FR).
3. **Jour 3** — Hooks tenant : assignation `tenant` automatique, `tenantMemberships` optimisés, `requireTenantRole`.
4. **Jour 4** — Middleware Next.js : résolution du tenant via `Host`, `x-courir-tenant-id`, `resolveTenant`.
5. **Jour 5** — Hub global : page `/`, `/events`, filtres région/date/type, formulaires minimalistes.
6. **Jour 6** — Pages organisateurs : builder sections (hero, FAQ, partenaires), page Infos, page Inscription (lien Njuko/NextRun).
7. **Jour 7** — Tests multi-domaine : validation admin, accès tenant, 404s, translations, lancement en prod.

## Fichiers clés à surveiller

- `src/payload.config.ts` : configuration Payload + translations.
- `src/access/tenants.ts` : ACL multi-tenant, `requireTenantRole`, cache des memberships.
- `src/hooks/assignTenant.ts` : attribution automatique du tenant.
- `src/utilities/resolveTenant.ts` : correspondance host → tenant.
- `middleware.ts` : injection des headers tenant.
- `src/app/(frontend)/[slug]/page.tsx` : rendu tenant + metadata.

## Prochaines étapes

- Générer les types : `npm run generate:types`.
- Si tu as besoin d’ajouter des composants personnalisés dans l’admin, utilise `admin.components` et regénère `payload` import map (`npm run generate:importmap`).
- Normalise les traductions FR/EN via `@payloadcms/translations` si tu veux mondifier l’UI admin.
