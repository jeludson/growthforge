# 🚀 Auto Commit Guide

This guide will set up automatic commits of your modified changes to GitHub!

---

## ✅ What We Did
Created `.github/workflows/auto-commit.yml` that:
- Checks for changes every **2 hours**
- Auto-commits any modified files
- Pushes to your main branch automatically

---

## 📋 Step 1: No Extra Secrets Needed!
This uses the built-in `GITHUB_TOKEN`, so you don't need to add any secrets! Perfect!

---

## 📋 Step 2: Commit and Push the Workflow
First, we need to push the auto-commit workflow to GitHub! Run these commands in your terminal:

```bash
cd d:\selprojects\sitedoc

# Add all files
git add .github/workflows/auto-commit.yml AUTO_COMMIT.md

# Commit
git commit -m "Add auto-commit workflow"

# Push
git push origin main
```

---

## 🎯 That's It!
Now the GitHub Actions bot will:
1. Check your repo every 2 hours
2. Auto-commit any new changes
3. Push them to main!

---

## 💡 Bonus: Manually Trigger Auto-Commit
You can also run it manually anytime:
1. Go to https://github.com/jeludson/growthforge/actions
2. Click "Auto Commit Changes"
3. Click "Run workflow" → "Run workflow"

---

## 🔧 Customize (Optional)
Want to change how often it runs? Edit `.github/workflows/auto-commit.yml`:
- Change `cron: '0 */2 * * *'` (every 2 hours) to:
  - `'0 * * * *'` - Every hour
  - `'0 0 * * *'` - Every day at midnight
