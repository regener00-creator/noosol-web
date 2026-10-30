param(
  [Parameter(Mandatory = $true)][string]$SourceArchive,
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

# The original photos and measurement arrows stay at 50 pixels per inch.
# Only the common title, color key, A4 reference, and bottom ruler are laid out again.
$archive = [System.IO.Compression.ZipFile]::OpenRead($SourceArchive)
$fontDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('noosol-guide-fonts-' + [guid]::NewGuid())
[System.IO.Directory]::CreateDirectory($fontDirectory) | Out-Null
$fonts = [System.Drawing.Text.PrivateFontCollection]::new()
foreach ($fontName in @('GoogleSans-Regular.ttf', 'GoogleSans-Bold.ttf')) {
  $entry = $archive.GetEntry('NOOSOL_17_Scales_A4/fonts/' + $fontName)
  $fontPath = Join-Path $fontDirectory $fontName
  [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $fontPath, $true)
  $fonts.AddFontFile($fontPath)
}
$family = $fonts.Families[0]
$headingFont = [System.Drawing.Font]::new($family, 80, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$captionFont = [System.Drawing.Font]::new($family, 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$a4Font = [System.Drawing.Font]::new($family, 76, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$dark = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#252c30'))
$gray = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#69777e'))
$white = [System.Drawing.Brushes]::White
$format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::MeasureTrailingSpaces
$center = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$center.Alignment = [System.Drawing.StringAlignment]::Center
$center.LineAlignment = [System.Drawing.StringAlignment]::Center
# Extra weight at the same font size and baseline, without moving the measurements.
function Draw-HeavyHeading {
  param([System.Drawing.Graphics]$Canvas, [string]$Text, [System.Drawing.Brush]$Brush, [single]$X, [single]$Y)
  $offsets = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(-1.5, 0),
    [System.Drawing.PointF]::new(1.5, 0),
    [System.Drawing.PointF]::new(0, -1.25),
    [System.Drawing.PointF]::new(0, 1.25),
    [System.Drawing.PointF]::new(0, 0)
  )
  foreach ($offset in $offsets) {
    $Canvas.DrawString($Text, $headingFont, $Brush, [System.Drawing.PointF]::new(($X + $offset.X), ($Y + $offset.Y)), $format)
  }
}
$palette = @('#ffffff', '#222222', '#66cce5', '#f4df28', '#e32626', '#e878b0')
$sixColorModels = @('05402', '04255', '11740', '09106', '04257', '05891', '07041', '04259', '07073')
$metadataEntry = $archive.GetEntry('NOOSOL_17_Scales_A4/measurements.json')
$reader = [System.IO.StreamReader]::new($metadataEntry.Open(), [System.Text.Encoding]::UTF8)
$measurements = $reader.ReadToEnd() | ConvertFrom-Json
$reader.Dispose()
$products = Get-Content -Raw -LiteralPath (Join-Path $ProjectRoot 'data/products.json') -Encoding UTF8 | ConvertFrom-Json
$outputDirectory = Join-Path $ProjectRoot 'public/size-guides'
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -EQ 'image/jpeg'
$jpegParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$jpegParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]90)
$index = 0
$manifest = @()

foreach ($item in $measurements.items) {
  $index++
  $product = $products | Where-Object code -EQ $item.model | Select-Object -First 1
  $stockDimensions = @($product.size -split ' x ' | ForEach-Object { [double]$_ })
  if ($stockDimensions[0] -ne $item.width_in -or $stockDimensions[1] -ne $item.height_in) {
    throw ('Source photo dimensions disagree with stock data for ' + $item.model)
  }
  $stockGusset = if ($stockDimensions.Count -eq 3) { $stockDimensions[2] } else { 0 }
  $replaceGussetLabel = $stockGusset -ne $item.gusset_in
  $item.gusset_in = $stockGusset
  $entry = $archive.GetEntry('NOOSOL_17_Scales_A4/' + $item.file)
  $stream = $entry.Open()
  $loaded = [System.Drawing.Image]::FromStream($stream)
  $source = [System.Drawing.Bitmap]::new($loaded)
  $loaded.Dispose()
  $stream.Dispose()
  if ($source.Width -ne 2000 -or $source.Height -ne 2000) { throw 'Unexpected source canvas' }
  $output = [System.Drawing.Bitmap]::new(2000, 2000)
  $graphics = [System.Drawing.Graphics]::FromImage($output)
  $graphics.DrawImageUnscaled($source, 0, 0)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  # The current stock record is authoritative when an old depth caption differs.
  if ($replaceGussetLabel) {
    $panelLeft = [single]($measurements.bag_front_right_x - $item.front_width_px + 10)
    $panelRight = [single]($measurements.bag_front_right_x - 10)
    $panelPoints = [System.Drawing.PointF[]]@(
      [System.Drawing.PointF]::new($panelLeft, 1640),
      [System.Drawing.PointF]::new(($panelRight - 20), 1640),
      [System.Drawing.PointF]::new($panelRight, 1710),
      [System.Drawing.PointF]::new($panelLeft, 1710)
    )
    $panelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#3f4446'))
    $depthFont = [System.Drawing.Font]::new($family, 32, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.FillPolygon($panelBrush, $panelPoints)
    $graphics.DrawString(('ขยายข้างและก้น ' + $stockGusset + ' นิ้ว'), $depthFont, $white, [System.Drawing.RectangleF]::new($panelLeft, 1640, ($panelRight - $panelLeft), 70), $center)
    $panelBrush.Dispose()
    $depthFont.Dispose()
  }

  # Replace the old two-line heading, note, and page number.
  $graphics.FillRectangle($white, 0, 0, 1700, 380)
  $graphics.FillRectangle($white, 1700, 0, 300, 180)
  $category = if ($index -le 5) { 'รุ่นเรียบ' } elseif ($index -le 10) { 'รุ่นขยายก้น' } else { 'รุ่นขยายข้างและก้น' }
  $categoryColor = if ($index -le 5) { '#8673a9' } elseif ($index -le 10) { '#478271' } else { '#416a79' }
  $categoryBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($categoryColor))
  $prefix = 'NO.' + $item.model + ' : '
  $prefixWidth = $graphics.MeasureString($prefix, $headingFont, 1800, $format).Width
  Draw-HeavyHeading -Canvas $graphics -Text $prefix -Brush $dark -X 90 -Y 155
  $graphics.DrawString($category, $headingFont, $categoryBrush, [System.Drawing.PointF]::new((90 + $prefixWidth), 155), $format)
  $colors = if ($sixColorModels -contains $item.model) { $palette } else { @($palette[0], $palette[1], $palette[2], $palette[5]) }
  $dotOutline = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#b7bfc4'), 1.5)
  for ($colorIndex = 0; $colorIndex -lt $colors.Count; $colorIndex++) {
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($colors[$colorIndex]))
    $graphics.FillEllipse($brush, (90 + $colorIndex * 80), 297, 55, 55)
    if ($colorIndex -eq 0) { $graphics.DrawEllipse($dotOutline, (90 + $colorIndex * 80), 297, 55, 55) }
    $brush.Dispose()
  }

  # Rebuild the A4 graphic at the original physical scale and common baseline.
  $graphics.FillRectangle($white, 0, 1000, 650, 865)
  $paperX = [single]90
  $paperWidth = [single]$measurements.a4_px[0]
  $paperHeight = [single]$measurements.a4_px[1]
  $paperY = [single]($measurements.baseline_y - $paperHeight)
  $paperRect = [System.Drawing.RectangleF]::new($paperX, $paperY, $paperWidth, $paperHeight)
  $paperBorder = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#b4bec4'), 2)
  $graphics.FillRectangle($white, $paperRect)
  $graphics.DrawRectangle($paperBorder, $paperX, $paperY, $paperWidth, $paperHeight)
  $fold = [single]30
  $foldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#edf0f2'))
  $foldPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(($paperX + $paperWidth - $fold), $paperY),
    [System.Drawing.PointF]::new(($paperX + $paperWidth - $fold), ($paperY + $fold)),
    [System.Drawing.PointF]::new(($paperX + $paperWidth), ($paperY + $fold))
  )
  $graphics.FillPolygon($foldBrush, $foldPoints)
  $graphics.DrawLines($paperBorder, $foldPoints)
  $graphics.DrawString('A4', $a4Font, $dark, $paperRect, $center)
  $captionRect = [System.Drawing.RectangleF]::new($paperX, ($paperY - 84), $paperWidth, 52)
  $graphics.DrawString('กว้าง 8.27 x สูง 11.69 นิ้ว', $captionFont, $gray, $captionRect, $center)

  # Move the original horizontal ruler upward without changing its tick spacing.
  $graphics.FillRectangle($white, 0, 1850, 2000, 150)
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 1745, 1845, 95), [System.Drawing.Rectangle]::new(0, 1850, 1845, 95), [System.Drawing.GraphicsUnit]::Pixel)

  $filename = [System.IO.Path]::GetFileName($item.file)
  $path = Join-Path $outputDirectory $filename
  $graphics.Dispose()
  # 1600px is ample for the 896px gallery and keeps downloads small.
  $webImage = [System.Drawing.Bitmap]::new(1600, 1600)
  $webGraphics = [System.Drawing.Graphics]::FromImage($webImage)
  $webGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $webGraphics.DrawImage($output, 0, 0, 1600, 1600)
  $webGraphics.Dispose()
  $webImage.Save($path, $jpegCodec, $jpegParameters)
  $webImage.Dispose()
  $output.Dispose()
  $source.Dispose()
  $categoryBrush.Dispose()
  $dotOutline.Dispose()
  $paperBorder.Dispose()
  $foldBrush.Dispose()
  $manifest += [ordered]@{
    code = $item.model
    category = $category
    width = $item.width_in
    height = $item.height_in
    gusset = $item.gusset_in
    src = '/size-guides/' + $filename + '?v=' + (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.Substring(0, 12).ToLowerInvariant()
    colors = @($colors)
  }
}
$manifestJson = ConvertTo-Json -InputObject $manifest -Depth 5
[System.IO.File]::WriteAllText((Join-Path $ProjectRoot 'data/size-guides.json'), $manifestJson + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
$headingFont.Dispose()
$captionFont.Dispose()
$a4Font.Dispose()
$fonts.Dispose()
$archive.Dispose()
$dark.Dispose()
$gray.Dispose()
$format.Dispose()
$center.Dispose()
$jpegParameters.Dispose()
Write-Output ('Created ' + $manifest.Count + ' size guides in ' + $outputDirectory)
& (Join-Path $PSScriptRoot 'build-mini-size-guides.ps1') -SourceArchive $SourceArchive -ProjectRoot $ProjectRoot
