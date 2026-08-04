# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Backend & espace admin

Le site est adossé à une base Postgres (Vercel Postgres / Neon) via Drizzle ORM,
avec un espace d'administration protégé par mot de passe sur `/admin`.

### 1. Configurer les variables d'environnement

```sh
cp .env.example .env
```

- `DATABASE_URL` : créez une base dans l'onglet **Storage** du dashboard Vercel
  (Postgres / Neon), puis copiez la chaîne de connexion.
- `SESSION_SECRET` : générez-en une avec `bun run scripts/generate-secret.ts`.
- `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` : choisissez un identifiant, puis
  générez le hash du mot de passe avec :
  ```sh
  bun run scripts/hash-password.ts "votre-mot-de-passe"
  ```
  Collez le résultat dans `ADMIN_PASSWORD_HASH`. Le mot de passe en clair n'est
  jamais stocké.

### 2. Créer les tables et charger des données de départ

```sh
bun run db:push    # applique le schéma (src/db/schema.ts) à la base
bun run db:seed    # (optionnel) importe le contenu de démonstration existant
```

`bun run db:studio` ouvre une interface visuelle sur la base de données.

### 3. Se connecter à l'admin

Démarrez le site (`bun run dev`) puis rendez-vous sur `/admin/login` avec les
identifiants configurés ci-dessus. L'espace admin permet de gérer les streams
TV/radio, les replays, les émissions, les articles du Webzine, les podcasts,
les flash infos et le programme en cours — le site public lit désormais ces
données directement depuis la base.

La session admin est un cookie chiffré et signé (httpOnly, `secure` en
production), et chaque action d'écriture est revérifiée côté serveur — un
accès direct à une route d'API sans session valide est rejeté même si l'écran
d'admin n'est pas affiché.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Drizzle ORM + Postgres (Vercel Postgres / Neon)
