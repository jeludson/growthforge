# 🚀 GrowthForge AI - Auto Commit & Auto Deploy Guide

This guide will show you how to set up fully automatic commits and deployments!

---

## 📋 Step 1: Add Secrets to GitHub Repo

First, go to https://github.com/jeludson/growthforge/settings/secrets/actions and add these secrets:

### For Vercel (Frontend)
1. Go to https://vercel.com/account/tokens → Create a new token named `GITHUB_ACTION`
2. Add to GitHub secrets as:
   - `VERCEL_TOKEN`: Your Vercel token
3. Get your ORG_ID and PROJECT_ID from Vercel project settings → Add:
   - `ORG_ID`: Your Vercel Org ID
   - `PROJECT_ID`: Your Vercel Project ID

### For Railway (Backend)
1. Go to https://railway.app/account/tokens → Create a new token
2. Add to GitHub secrets as:
   - `RAILWAY_TOKEN`: Your Railway token

---

## 📋 Step 2: Use the GitHub Actions Workflow

We already created `.github/workflows/deploy.yml`! This workflow will:
- ✅ Auto-deploy frontend to Vercel on every push to main
- ✅ Auto-deploy backend to Railway on every push to main

---

## 📋 Step 3: Auto-Commit (Optional but Awesome!)

If you want a bot to auto-commit your changes periodically or on edit, use this:

### Option A: Use VS Code Auto Commit Extension
1. Install "Auto Commit" extension in VS Code
2. Configure it to auto-commit every X minutes

### Option B: Use GitHub Actions for Scheduled Commits
Add this to your workflow:
```yaml
name: Auto Commit
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch:

jobs:
  auto-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Auto Commit
        uses: EndBug/add-and-commit@v9
        with:
          author_name: 'github-actions[bot]'
          author_email: 'github-actions[bot]@users.noreply.github.com'
          message: 'Auto-commit: Update project'
```

---

## 🚀 That's It!

Now every time you push to main:
1. GitHub Actions will trigger
2. Frontend auto-deploys to Vercel
3. Backend auto-deploys to Railway

No more manual deploying! 🎉

---

## 💡 Quick Tips
- **Test Locally First**: Always test changes locally before pushing!
- **Check Deployment Status**: Go to your Vercel/Railway dashboards to see deployment status
- **Rollback if Needed**: Both Vercel and Railway support one-click rollbacks
