# push-to-github.ps1
# Interactive helper: initialize repo, commit, and push to GitHub (PowerShell)
# Run this from the project root: .\push-to-github.ps1

# Check for git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "git is not installed or not on PATH. Please install Git (https://git-scm.com/downloads) and re-run this script." -ForegroundColor Yellow
    exit 1
}

# Initialize repo if needed
if (-not (Test-Path .git)) {
    git init
    Write-Host "Initialized empty git repository." -ForegroundColor Green
} else {
    Write-Host "Git repository already exists." -ForegroundColor Green
}

# Ensure .gitignore exists
if (-not (Test-Path .gitignore)) {
    @"
# OS files
.DS_Store
Thumbs.db

# Node and build
node_modules/
dist/
build/

# Env files
.env

# Logs
npm-debug.log*
*.log

# IDE
.vscode/
.idea/

# Mac
._*

# Windows
desktop.ini

# Images generated for development - keep originals
*.psd
"@ | Out-File -Encoding UTF8 .gitignore
    Write-Host ".gitignore created." -ForegroundColor Green
}

# Stage and commit
git add -A
$commitMsg = Read-Host "Commit message (default: Initial commit: Calm Nerve landing page)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) { $commitMsg = "Initial commit: Calm Nerve landing page" }
# If no commits exist, run commit; otherwise skip if nothing to commit
try {
    git commit -m "$commitMsg" -q
    Write-Host "Committed changes." -ForegroundColor Green
} catch {
    Write-Host "Nothing to commit or commit failed: $_" -ForegroundColor Yellow
}

# Ask whether to create remote via gh or use existing remote URL
$choice = Read-Host "Do you want to (1) create repo via gh CLI, (2) add existing remote URL, or (3) open GitHub to create manually? Enter 1,2 or 3"
if ($choice -eq '1') {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-Host "gh CLI not found. Install it from https://cli.github.com/ and run 'gh auth login' before re-running this option." -ForegroundColor Yellow
        exit 1
    }
    $repoName = Read-Host "Repository name (default: calm-nerve-landing)"
    if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "calm-nerve-landing" }
    gh repo create $repoName --public --source=. --remote=origin --push
    Write-Host "Created repo and pushed via gh." -ForegroundColor Green
} elseif ($choice -eq '2') {
    $remote = Read-Host "Enter remote HTTPS URL (e.g. https://github.com/you/repo.git)"
    if (-not [string]::IsNullOrWhiteSpace($remote)) {
        git remote add origin $remote
        git branch -M main
        git push -u origin main
        Write-Host "Pushed to $remote" -ForegroundColor Green
    } else {
        Write-Host "No remote provided. Aborting." -ForegroundColor Red
    }
} else {
    Write-Host "Opening GitHub new repo page in your browser. Create a repo (no README) then return here and choose option 2 to add the remote and push." -ForegroundColor Cyan
    Start-Process "https://github.com/new"
}

Write-Host "Done. If you enabled GitHub Pages, it may take a minute for the site to become available." -ForegroundColor Green
