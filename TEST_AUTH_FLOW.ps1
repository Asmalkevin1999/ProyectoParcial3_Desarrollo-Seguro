# Script para probar el flujo de autenticación completo

$baseURL = "http://localhost:3005/api"

Write-Host "================================="
Write-Host "TEST: Flujo de Autenticación ERP"
Write-Host "================================="
Write-Host ""

# Paso 1: LOGIN
Write-Host "1️⃣  PASO 1: LOGIN"
Write-Host "URL: POST $baseURL/auth/login"
Write-Host "Body: { username: 'admin', password: 'Admin2026!' }"
Write-Host ""

$loginResponse = Invoke-WebRequest -Uri "$baseURL/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"Admin2026!"}' `
  -ErrorAction Stop

$loginData = $loginResponse.Content | ConvertFrom-Json
Write-Host "✅ Status: $($loginResponse.StatusCode)"
Write-Host "Response:"
Write-Host ($loginData | ConvertTo-Json -Depth 10 | ForEach-Object { "  $_" })
Write-Host ""

$tempToken = $loginData.tempToken
$roles = $loginData.roles

if (-not $tempToken) {
  Write-Host "❌ ERROR: No se recibió tempToken"
  exit 1
}

Write-Host "✅ tempToken recibido: $($tempToken.Substring(0, 20))..."
Write-Host "✅ Roles disponibles: $($roles | ConvertTo-Json)"
Write-Host ""

# Paso 2: SELECT ROLE
$roleId = $roles[0].id
Write-Host "2️⃣  PASO 2: SELECT ROLE"
Write-Host "URL: POST $baseURL/auth/select-role"
Write-Host "Headers: Authorization: Bearer $($tempToken.Substring(0, 20))..."
Write-Host "Body: { roleId: '$roleId' }"
Write-Host ""

try {
  $selectRoleResponse = Invoke-WebRequest -Uri "$baseURL/auth/select-role" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ "Authorization" = "Bearer $tempToken" } `
    -Body "{`"roleId`":`"$roleId`"}" `
    -ErrorAction Stop

  $selectRoleData = $selectRoleResponse.Content | ConvertFrom-Json
  Write-Host "✅ Status: $($selectRoleResponse.StatusCode)"
  Write-Host "Response:"
  Write-Host ($selectRoleData | ConvertTo-Json -Depth 5 | ForEach-Object { "  $_" })
  Write-Host ""

  $accessToken = $selectRoleData.accessToken
  $refreshToken = $selectRoleData.refreshToken

  if (-not $accessToken) {
    Write-Host "❌ ERROR: No se recibió accessToken"
    exit 1
  }

  Write-Host "✅ accessToken recibido: $($accessToken.Substring(0, 20))..."
  Write-Host "✅ refreshToken recibido: $($refreshToken.Substring(0, 20))..."
  Write-Host ""

  # Paso 3: GET MENUS
  Write-Host "3️⃣  PASO 3: GET MENUS"
  Write-Host "URL: GET $baseURL/menus/my-menu"
  Write-Host "Headers: Authorization: Bearer $($accessToken.Substring(0, 20))..."
  Write-Host ""

  try {
    $menuResponse = Invoke-WebRequest -Uri "$baseURL/menus/my-menu" `
      -Method GET `
      -Headers @{ "Authorization" = "Bearer $accessToken" } `
      -ErrorAction Stop

    $menuData = $menuResponse.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($menuResponse.StatusCode)"
    Write-Host "✅ Menús recibidos: $($menuData.Count) módulos"
    Write-Host "Response:"
    Write-Host ($menuData | ConvertTo-Json -Depth 5 | ForEach-Object { "  $_" })
    Write-Host ""

    Write-Host "✅ ✅ ✅ FLUJO COMPLETO EXITOSO ✅ ✅ ✅"
    Write-Host ""

  } catch {
    Write-Host "❌ ERROR en GET /api/menus/my-menu: $($_.Exception.Message)"
    Write-Host ""
    if ($_.Exception.Response) {
      $errorContent = $_.Exception.Response.Content.ReadAsStream()
      $reader = New-Object System.IO.StreamReader($errorContent)
      $errorBody = $reader.ReadToEnd()
      Write-Host "Response Body: $errorBody"
    }
  }

} catch {
  Write-Host "❌ ERROR en POST /api/auth/select-role: $($_.Exception.Message)"
  Write-Host ""
  if ($_.Exception.Response) {
    $errorContent = $_.Exception.Response.Content.ReadAsStream()
    $reader = New-Object System.IO.StreamReader($errorContent)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Response Body: $errorBody"
  }
}
