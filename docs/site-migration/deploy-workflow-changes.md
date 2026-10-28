# Deploy workflow for one bucket

Done locally in `SalsaMobi-dev/betterengineer-marketing-site` (commit `8f4a2d9` on `main`, not pushed). Pushing to `main` runs the deploy.

Bucket layout: discover at the root, www under `www/`.

Changes to `.github/workflows/deploy.yml`:

- Both discover syncs (`site/` to the bucket root) add `--exclude "www/*"`. Excluded keys are never deleted, so the root `--delete` can't wipe www, and nothing named `www/` in `site/` is uploaded as discover.
- Two new steps sync the repo's `www/` folder to `s3://$BUCKET/www/`: assets with `public,max-age=86400` (skips `*.md`), then HTML with `public,max-age=300`. Both use `--delete`, which only touches keys under `www/`. Content types come from the AWS CLI's file-extension guess (html, css, js, png, jpg, svg, pdf, xml, mp4, txt are all standard).
- Invalidation stays `/*`, which covers both sites.

The repo's `www/` folder is the prebuilt `dist-www/` from this repo; it is not rebuilt in CI. To update www: rebuild `dist-www`, `robocopy dist-www ..\betterengineer-marketing-site\www /MIR`, commit, push.

IAM: the workflow signs in with the OIDC role in the repo variable `AWS_DEPLOY_ROLE_ARN`. Its policy is not visible from the repo. The workflow only uses `s3 sync` and `cloudfront create-invalidation`, so assume it cannot edit CloudFront Functions, certificates, or distributions; Josh does those in the console.
