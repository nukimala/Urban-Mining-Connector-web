# ================================================
#  Urban Mining Connector — Firebase Setup Script
#  Jalankan script ini di PowerShell
# ================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  URBAN MINING CONNECTOR — Firebase Setup  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "[STEP 1/4] Login ke Firebase..." -ForegroundColor Yellow
Write-Host "Browser akan terbuka. Silakan login dengan akun Google kamu." -ForegroundColor Gray
Write-Host ""
firebase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Login gagal. Coba jalankan script ini lagi." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit
}

Write-Host ""
Write-Host "[STEP 2/4] Membuat project Firebase baru..." -ForegroundColor Yellow
Write-Host ""

# Step 2: Create project
$projectId = "urban-mining-connector-$(Get-Random -Maximum 9999)"
Write-Host "Membuat project dengan ID: $projectId" -ForegroundColor Gray
firebase projects:create $projectId --display-name "Urban Mining Connector"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Project dengan nama itu sudah ada, atau terjadi error." -ForegroundColor Red
    Write-Host "Masukkan Project ID yang unik (huruf kecil, angka, tanda hubung):" -ForegroundColor Yellow
    $projectId = Read-Host "Project ID"
    firebase projects:create $projectId --display-name "Urban Mining Connector"
}

# Step 3: Write .firebaserc
Write-Host ""
Write-Host "[STEP 3/4] Menghubungkan project ke folder ini..." -ForegroundColor Yellow

$fireabaserc = @{
    projects = @{
        default = $projectId
    }
} | ConvertTo-Json -Depth 5

$fireabaserc | Out-File -FilePath ".\.firebaserc" -Encoding UTF8
Write-Host "File .firebaserc berhasil dibuat!" -ForegroundColor Green

# Step 4: Enable Hosting & Deploy
Write-Host ""
Write-Host "[STEP 4/4] Mendeploy website ke Firebase Hosting..." -ForegroundColor Yellow
Write-Host ""
firebase deploy --only hosting

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DEPLOY BERHASIL!  " -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "Website kamu sudah online di:" -ForegroundColor White
    Write-Host "  https://$projectId.web.app" -ForegroundColor Cyan
    Write-Host "  https://$projectId.firebaseapp.com" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Deploy gagal. Cek pesan error di atas." -ForegroundColor Red
}

Read-Host "Tekan Enter untuk menutup"
