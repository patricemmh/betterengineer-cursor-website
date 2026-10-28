# Deploy workflow changes for one bucket (draft, not pushed)

www files live in `s3://betterengineer-marketing-site/www/`. Discover files stay at the bucket root.

## 1. Required before the first www upload: marketing-site repo

Repo `SalsaMobi-dev/betterengineer-marketing-site`, file `.github/workflows/deploy.yml`. The first sync runs with `--delete` at the bucket root, so the next discover deploy would delete every www file. Add one exclude to that step (excluded keys are never deleted):

```diff
       - name: Upload assets (cached 1 day)
         run: |
           aws s3 sync site/ "s3://$BUCKET" --delete \
+            --exclude "www/*" \
             --exclude "*.html" \
             --cache-control "public,max-age=86400"
```

The second sync (HTML) has no `--delete`, so it needs no change. The `/*` invalidation also clears www cache; that is harmless.

Until this is merged on `main`, do not push to the marketing-site repo (or disable the "Deploy site" workflow in its Actions tab).

## 2. Later: a www deploy workflow in this repo

Same OIDC role as discover. Josh adds `repo:patricemmh/betterengineer-cursor-website:*` to the role's trust policy (or we move the www build into the marketing-site repo). Repo variables: `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `AWS_DEPLOY_ROLE_ARN`, plus a `production` environment.

```yaml
name: Deploy www
on:
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    env:
      BUCKET: ${{ vars.S3_BUCKET }}
      DISTRIBUTION_ID: ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Build www bundle
        run: INTERNAL_LINKS=local npm run build && node build-www-dist.js
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: us-east-1
      - name: Upload assets (cached 1 day)
        run: |
          aws s3 sync dist-www/ "s3://$BUCKET/www/" --delete \
            --exclude "*.html" --exclude "*.md" \
            --cache-control "public,max-age=86400"
      - name: Upload HTML pages (cached 5 minutes)
        run: |
          aws s3 sync dist-www/ "s3://$BUCKET/www/" \
            --exclude "*" --include "*.html" \
            --cache-control "public,max-age=300"
      - name: Clear the CloudFront cache
        run: aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
```

`--delete` here is safe because it is scoped to the `www/` prefix. The `deploy-production` concurrency group matches discover only if both workflows live in the same repo; across repos they can overlap, which is fine because they write different prefixes.
