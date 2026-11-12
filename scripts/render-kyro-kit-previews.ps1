$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime]
$null = [Windows.Data.Pdf.PdfPageRenderOptions, Windows.Data.Pdf, ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType=WindowsRuntime]

function Wait-PolarisOperation($Operation, $ResultType) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
  $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  $task.Result
}
function Wait-PolarisAction($Operation) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
  $task = $method.Invoke($null, @($Operation))
  $task.Wait()
}

$pdfPath = Join-Path (Get-Location).Path 'public/downloads/Kyro_Learning_Home_Leadership_Kit.pdf'
if ((Get-FileHash -LiteralPath $pdfPath -Algorithm SHA256).Hash.ToLower() -ne '69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da') { throw 'Unexpected source PDF hash' }
$file = Wait-PolarisOperation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
$document = Wait-PolarisOperation ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
if ($document.PageCount -ne 8) { throw 'Expected eight pages' }
New-Item -ItemType Directory -Force public/images/home-leadership-kit/previews/kyro | Out-Null
foreach ($pageNumber in @(1, 3, 7)) {
  $page = $document.GetPage($pageNumber - 1)
  $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $options.DestinationWidth = 900
  Wait-PolarisAction ($page.RenderToStreamAsync($stream, $options))
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $null = Wait-PolarisOperation ($reader.LoadAsync([uint32]$stream.Size)) ([uint32])
  $bytes = New-Object byte[] $stream.Size
  $reader.ReadBytes($bytes)
  if ($bytes.Length -lt 1000) { throw 'Invalid rendered image' }
  $outputPath = Join-Path (Get-Location).Path "public/images/home-leadership-kit/previews/kyro/page-$pageNumber.png"
  [System.IO.File]::WriteAllBytes($outputPath, $bytes)
  $reader.Dispose()
  $stream.Dispose()
  $page.Dispose()
  Write-Output $outputPath
}
