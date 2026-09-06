# themoviedb-discovery-app-demo-2026-2027

## Instancier le backlog GitHub Projects

Le backlog pédagogique est défini dans le dépôt, dans les fichiers suivants :

- `.github/backlog.yml` : milestones et tickets à créer.
- `.github/labels.yml` : labels communs à tous les étudiants.
- `scripts/bootstrap-backlog.mjs` : script d'instanciation GitHub.

Chaque étudiant peut créer son propre backlog GitHub à partir de ces fichiers.

### Prérequis

1. Installer GitHub CLI : <https://cli.github.com/>
2. Se connecter à GitHub :

```bash
gh auth login
```

3. Vérifier que l'authentification dispose des droits Projects :

```bash
gh auth refresh -s project
```

### Création du backlog

Depuis le dépôt de l'étudiant :

```bash
npm install
npm run bootstrap:backlog -- --dry-run
npm run bootstrap:backlog
```

Si le dépôt GitHub ne peut pas être détecté automatiquement, il est possible de le préciser explicitement :

```bash
npm run bootstrap:backlog -- --repo owner/repository
```

Les GitHub Projects actuels ne sont pas stockés directement dans un dépôt : ils appartiennent soit à un compte utilisateur, soit à une organisation. Par défaut, le script crée donc le Project chez le propriétaire du dépôt indiqué par `--repo`.

Par exemple, avec :

```bash
npm run bootstrap:backlog -- --repo but-sd/themoviedb-discovery-app-demo-2026-2027
```

le Project est créé dans l'organisation `but-sd`, car le dépôt appartient à cette organisation.

Pour créer les issues dans le dépôt, mais créer le Project dans son propre compte GitHub, utiliser :

```bash
npm run bootstrap:backlog -- --repo but-sd/themoviedb-discovery-app-demo-2026-2027 --project-owner @me
```

Il est aussi possible de préciser explicitement un compte ou une organisation :

```bash
npm run bootstrap:backlog -- --repo owner/repository --project-owner github-login
```

Le script est idempotent : il peut être relancé après modification de `.github/backlog.yml` ou `.github/labels.yml`. Les tickets sont retrouvés grâce à leur champ `id`, puis mis à jour au lieu d'être recréés.

### Comment instancier son backlog étudiant

Chaque étudiant doit exécuter l'instanciation depuis son propre dépôt GitHub, par exemple après avoir forké ou créé son dépôt à partir du template du projet.

1. Cloner son dépôt :

```bash
git clone git@github.com:OWNER/REPOSITORY.git
cd REPOSITORY
```

2. Installer les dépendances du projet :

```bash
npm install
```

3. Se connecter à GitHub avec la CLI :

```bash
gh auth login
gh auth refresh -s project
```

4. Vérifier la configuration du backlog sans rien créer :

```bash
npm run bootstrap:backlog -- --dry-run
```

5. Créer les labels, milestones, tickets et le GitHub Project :

```bash
npm run bootstrap:backlog
```

À la fin de l'exécution, le script affiche deux liens : un vers les issues créées dans le dépôt et un vers le GitHub Project associé. Les vues du Project sont configurées à partir du champ `project.views` dans `.github/backlog.yml`. Si un ticket existe déjà, il est mis à jour au lieu d'être recréé.

Les vues créées par défaut sont :

- `Backlog étudiant` : vue Kanban globale.
- `Sprint courant` : vue table filtrée sur `Sprint 1`.
- `Bonus` : vue table filtrée sur les tickets optionnels.

Le Project contient aussi un champ `Poids` pour aider à choisir les tickets à traiter. Les valeurs utilisent des tailles T-shirt :

- `XS` : très petit ticket.
- `S` : petit ticket.
- `M` : ticket moyen.
- `L` : gros ticket.
- `XL` : très gros ticket.

Chaque ticket peut définir son poids avec le champ `weight` dans `.github/backlog.yml`.

Le champ `Poids` est affiché dans les vues grâce à `visibleFields` :

```yaml
views:
  - name: "Backlog étudiant"
    layout: "board"
    visibleFields:
      - "Title"
      - "Status"
      - "Poids"
      - "Labels"
      - "Milestone"
```
