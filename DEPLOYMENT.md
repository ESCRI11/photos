# GitHub Pages Deployment Guide

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Quick Start

```bash
# Check if everything is ready for deployment
make deploy-check

# Test the static export locally
make export

# Preview the static site (served on http://localhost:8000)
make preview-export
```

## Setup Steps

### 1. Create GitHub Repository

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the changes

### 3. Deploy

Every push to the `main` branch will automatically trigger a deployment:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Action will:
- Install dependencies
- Build the Next.js project
- Export static files to `/out` directory
- Deploy to GitHub Pages

### 4. Access Your Site

After the first successful deployment, your site will be available at:
- `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` (for project repos)
- `https://YOUR_USERNAME.github.io/` (for user/org repos)

## Configuration Options

### Custom Domain

If deploying to a subdirectory (like `github.io/repo-name`), uncomment and configure the `basePath` in `next.config.mjs`:

```javascript
basePath: '/your-repo-name',
```

### Branch Configuration

By default, the workflow deploys from the `main` branch. To change this, edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - your-branch-name
```

## Local Testing

Before deploying, test your static export locally:

```bash
# Export the site
make export

# Preview on http://localhost:8000
make preview-export
```

## Troubleshooting

### Build Fails

- Check the Actions tab in your GitHub repository for error logs
- Ensure all dependencies are correctly listed in `package.json`
- Test the build locally with `make export`

### Images Not Loading

- Ensure `unoptimized: true` is set in `next.config.mjs` (already configured)
- Check image paths are relative and correct

### 404 on Routes

- Verify `output: 'export'` is set in `next.config.mjs` (already configured)
- GitHub Pages requires a trailing slash for directories

### Wrong Base Path

If your site loads but CSS/images are broken:
1. Uncomment `basePath` in `next.config.mjs`
2. Set it to your repository name: `basePath: '/your-repo-name'`

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make deploy-check` | Check deployment readiness |
| `make export` | Build and export static site |
| `make preview-export` | Preview exported site locally |
| `make clean` | Remove build artifacts |

## Files Structure

```
.github/
  workflows/
    deploy.yml          # GitHub Actions workflow
next.config.mjs         # Next.js config (with export settings)
public/
  .nojekyll            # Bypass Jekyll processing on GitHub Pages
out/                   # Generated static files (git-ignored)
```

## Additional Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)

