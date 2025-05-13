# Check if PostgreSQL is installed
$pgPath = "C:\Program Files\PostgreSQL\17\bin"
if (-not (Test-Path $pgPath)) {
    Write-Host "PostgreSQL is not installed. Please install PostgreSQL 17 first."
    exit 1
}

# Add PostgreSQL to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $currentPath.Contains($pgPath)) {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$pgPath", "User")
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Check if PostgreSQL service is running
$pgService = Get-Service postgresql* -ErrorAction SilentlyContinue
if (-not $pgService) {
    Write-Host "PostgreSQL service not found. Please check your installation."
    exit 1
}

if ($pgService.Status -ne "Running") {
    Write-Host "Starting PostgreSQL service..."
    Start-Service $pgService
}

# Wait for PostgreSQL to be ready
Start-Sleep -Seconds 5

# Create database and run setup script
Write-Host "Creating database and running setup script..."
$env:PGPASSWORD = "postgres"  # Change this to your actual password
psql -U postgres -f setup_database.sql

Write-Host "PostgreSQL setup completed successfully!" 