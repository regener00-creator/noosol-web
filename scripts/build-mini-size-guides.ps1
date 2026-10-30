param(
  [Parameter(Mandatory = $true)][string]$SourceArchive,
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

# The photo landmarks describe the front panel only, excluding handles and side panels.
# Map that panel to the stock dimensions at the same 50 px/inch as the first 17 guides.
$items = @(
  @{
    code = '06680'; category = 'รุ่นมินิขยายเฉพาะก้น'; color = '#478271'; page = 18
    crop = @(350, 300, 1225, 1480); panel = @(360, 885, 1207, 893)
    colors = @('#ffffff','#222222','#008dcc','#71d6ed','#13a7bd','#67e94c','#95eed9','#f4df28','#ffb12b','#f43b33','#d82e68','#f17bb1','#f6b1d1','#e0d1ee','#9559d7','#565656')
    depthLabel = 'ขยายเฉพาะก้น'
  },
  @{
    code = '10740'; category = 'รุ่นมินิขยายข้างและก้น'; color = '#416a79'; page = 19
    crop = @(620, 95, 735, 1860); panel = @(632, 785, 690, 1167)
    colors = @('#ffffff','#222222','#33336a','#527fc5','#72c8e0','#b1e2de','#8bbb54','#2e9a2f','#28612e','#e5df53','#f48b24','#e74b34','#ca2755','#d86eaa','#eeb6ce','#8a62bd','#70605c')
    depthLabel = 'ขยาย'
  }
)
$products = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $ProjectRoot 'data/products.json') | ConvertFrom-Json
$manifestPath = Join-Path $ProjectRoot 'data/size-guides.json'
$manifest = @(Get-Content -Raw -Encoding UTF8 -LiteralPath $manifestPath | ConvertFrom-Json | Where-Object { $_.code -notin @('06680', '10740') })
$archive = [System.IO.Compression.ZipFile]::OpenRead($SourceArchive)
$fontDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('noosol-mini-fonts-' + [guid]::NewGuid())
[System.IO.Directory]::CreateDirectory($fontDirectory) | Out-Null
$fonts = [System.Drawing.Text.PrivateFontCollection]::new()
foreach ($name in @('GoogleSans-Regular.ttf', 'GoogleSans-Bold.ttf')) {
  $path = Join-Path $fontDirectory $name
  [System.IO.Compression.ZipFileExtensions]::ExtractToFile($archive.GetEntry('NOOSOL_17_Scales_A4/fonts/' + $name), $path, $true)
  $fonts.AddFontFile($path)
}
$family = $fonts.Families[0]
$headingFont = [System.Drawing.Font]::new($family, 80, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$captionFont = [System.Drawing.Font]::new($family, 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$measureFont = [System.Drawing.Font]::new($family, 32, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$a4Font = [System.Drawing.Font]::new($family, 76, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$dark = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#252c30'))
$gray = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#69777e'))
$measurementBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#45636a'))
$depthBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#c0dfb3'))
$white = [System.Drawing.Brushes]::White
$format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::MeasureTrailingSpaces
$center = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$center.Alignment = [System.Drawing.StringAlignment]::Center
$center.LineAlignment = [System.Drawing.StringAlignment]::Center
$paperBorder = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#b4bec4'), 2)
$foldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#edf0f2'))
$dotOutline = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#b7bfc4'), 1.5)
$dimensionPen = [System.Drawing.Pen]::new($measurementBrush, 2)
$arrow = [System.Drawing.Drawing2D.AdjustableArrowCap]::new(4, 5, $true)
$dimensionPen.CustomStartCap = $arrow
$dimensionPen.CustomEndCap = $arrow
$extensionPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#83969b'), 1)
$extensionPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$rulerStream = $archive.GetEntry('NOOSOL_17_Scales_A4/images/p-01-05402.jpg').Open()
$rulers = [System.Drawing.Image]::FromStream($rulerStream)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -EQ 'image/jpeg'
$jpegParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$jpegParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]90)

function Draw-MeasureLabel {
  param([System.Drawing.Graphics]$Canvas, [string]$Text, [single]$X, [single]$Y)
  $size = $Canvas.MeasureString($Text, $measureFont, 1000, $format)
  $rect = [System.Drawing.RectangleF]::new(($X - $size.Width / 2 - 10), ($Y - 25), ($size.Width + 20), 50)
  $Canvas.FillRectangle($white, $rect)
  $Canvas.DrawString($Text, $measureFont, $measurementBrush, $rect, $center)
}

foreach ($item in $items) {
  $product = $products | Where-Object code -EQ $item.code | Select-Object -First 1
  if (-not $product) { throw ('Missing stock model ' + $item.code) }
  $dimensions = @($product.size -split ' x ' | ForEach-Object { [double]$_ })
  if ($dimensions.Count -ne 3) { throw ('Expected three stock dimensions for ' + $item.code) }
  $output = [System.Drawing.Bitmap]::new(2000, 2000)
  $graphics = [System.Drawing.Graphics]::FromImage($output)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  # Preserve the original inch rulers and their positions.
  $graphics.DrawImage($rulers, [System.Drawing.Rectangle]::new(1840, 180, 160, 1650), [System.Drawing.Rectangle]::new(1840, 180, 160, 1650), [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.DrawImage($rulers, [System.Drawing.Rectangle]::new(0, 1745, 1845, 95), [System.Drawing.Rectangle]::new(0, 1850, 1845, 95), [System.Drawing.GraphicsUnit]::Pixel)

  $prefix = 'NO.' + $item.code + ' : '
  $prefixWidth = $graphics.MeasureString($prefix, $headingFont, 1800, $format).Width
  foreach ($offset in @(@(-1.5,0), @(1.5,0), @(0,-1.25), @(0,1.25), @(0,0))) {
    $graphics.DrawString($prefix, $headingFont, $dark, [System.Drawing.PointF]::new((90 + $offset[0]), (155 + $offset[1])), $format)
  }
  $categoryBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($item.color))
  $graphics.DrawString($item.category, $headingFont, $categoryBrush, [System.Drawing.PointF]::new((90 + $prefixWidth), 155), $format)
  for ($i = 0; $i -lt $item.colors.Count; $i++) {
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($item.colors[$i]))
    $dotX = 90 + ($i % 5) * 80
    $dotY = 297 + [Math]::Floor($i / 5) * 80
    $graphics.FillEllipse($brush, $dotX, $dotY, 55, 55)
    if ($item.colors[$i] -eq '#ffffff') { $graphics.DrawEllipse($dotOutline, $dotX, $dotY, 55, 55) }
    $brush.Dispose()
  }

  # A4 remains 21 x 29.7 cm, aligned to the common bag baseline.
  $paperWidth = [single](21 / 2.54 * 50)
  $paperHeight = [single](29.7 / 2.54 * 50)
  $paperY = [single](1720 - $paperHeight)
  $paperRect = [System.Drawing.RectangleF]::new(90, $paperY, $paperWidth, $paperHeight)
  $graphics.DrawRectangle($paperBorder, 90, $paperY, $paperWidth, $paperHeight)
  $foldPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new((90 + $paperWidth - 30), $paperY),
    [System.Drawing.PointF]::new((90 + $paperWidth - 30), ($paperY + 30)),
    [System.Drawing.PointF]::new((90 + $paperWidth), ($paperY + 30))
  )
  $graphics.FillPolygon($foldBrush, $foldPoints)
  $graphics.DrawLines($paperBorder, $foldPoints)
  $graphics.DrawString('A4', $a4Font, $dark, $paperRect, $center)
  $graphics.DrawString('กว้าง 8.27 x สูง 11.69 นิ้ว', $captionFont, $gray, [System.Drawing.RectangleF]::new(90, ($paperY - 84), $paperWidth, 52), $center)

  $bodyWidth = [single]($dimensions[0] * 50)
  $bodyHeight = [single]($dimensions[1] * 50)
  $depthX = [single]($dimensions[2] * 50 * 0.36)
  $depthY = [single]($dimensions[2] * 50 * 0.28)
  $bodyRight = [single]1820
  $bodyLeft = [single]($bodyRight - $bodyWidth)
  $bodyTop = [single](1720 - $bodyHeight)
  $scaleX = $bodyWidth / $item.panel[2]
  $scaleY = $bodyHeight / $item.panel[3]
  $photo = [System.Drawing.Image]::FromFile((Join-Path $ProjectRoot ('assets/size-guide-sources/' + $item.code + '.png')))
  $destination = [System.Drawing.RectangleF]::new(
    ($bodyLeft + ($item.crop[0] - $item.panel[0]) * $scaleX),
    ($bodyTop + ($item.crop[1] - $item.panel[1]) * $scaleY),
    ($item.crop[2] * $scaleX), ($item.crop[3] * $scaleY)
  )
  $source = [System.Drawing.RectangleF]::new($item.crop[0], $item.crop[1], $item.crop[2], $item.crop[3])
  $graphics.DrawImage($photo, $destination, $source, [System.Drawing.GraphicsUnit]::Pixel)

  # Only 06680 keeps the shaded bottom guide. 10740 uses its original photo.
  if ($item.code -eq '06680') {
    $gussetFill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 80, 99, 102))
    $gussetEdge = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#a1c5bf'), 2)
    $bottomLeft = $bodyLeft + 25
    $bottomRight = 1805
    $basePoints = [System.Drawing.PointF[]]@(
      [System.Drawing.PointF]::new($bottomLeft, 1710),
      [System.Drawing.PointF]::new(($bottomLeft + $depthX), (1710 - $depthY)),
      [System.Drawing.PointF]::new(($bottomRight - $depthX), (1710 - $depthY)),
      [System.Drawing.PointF]::new($bottomRight, 1710)
    )
    $graphics.FillPolygon($gussetFill, $basePoints)
    $graphics.DrawPolygon($gussetEdge, $basePoints)
    $gussetFill.Dispose(); $gussetEdge.Dispose()
  }
  $widthY = [single]($bodyTop - 42)
  $heightX = [single]($bodyLeft - 75)
  $graphics.DrawLine($extensionPen, $bodyLeft, $bodyTop, $bodyLeft, ($widthY - 10))
  $graphics.DrawLine($extensionPen, $bodyRight, $bodyTop, $bodyRight, ($widthY - 10))
  $graphics.DrawLine($extensionPen, ($heightX - 10), $bodyTop, $bodyLeft, $bodyTop)
  $graphics.DrawLine($extensionPen, ($heightX - 10), 1720, $bodyLeft, 1720)
  $graphics.DrawLine($dimensionPen, $bodyLeft, $widthY, $bodyRight, $widthY)
  $graphics.DrawLine($dimensionPen, $heightX, $bodyTop, $heightX, 1720)
  $widthLabelX = if ($dimensions[0] -lt 6) { $bodyLeft - 170 } else { $bodyLeft + $bodyWidth / 2 }
  Draw-MeasureLabel $graphics ('กว้าง ' + $dimensions[0] + ' นิ้ว') $widthLabelX $widthY
  Draw-MeasureLabel $graphics ('สูง ' + $dimensions[1] + ' นิ้ว') $heightX ($bodyTop + $bodyHeight / 2)
  # Place the depth caption inside each bag's bottom, like the other guides.
  $depthRect = if ($item.code -eq '06680') {
    [System.Drawing.RectangleF]::new($bottomLeft, (1710 - $depthY), ($bottomRight - $bottomLeft), $depthY)
  } else {
    [System.Drawing.RectangleF]::new(($bodyLeft + 8), 1658, ($bodyWidth - 16), 52)
  }
  $graphics.DrawString(($item.depthLabel + ' ' + $dimensions[2] + ' นิ้ว'), $measureFont, $depthBrush, $depthRect, $center)

  $filename = 'p-' + $item.page + '-' + $item.code + '.jpg'
  $path = Join-Path $ProjectRoot ('public/size-guides/' + $filename)
  $webImage = [System.Drawing.Bitmap]::new(1600, 1600)
  $webGraphics = [System.Drawing.Graphics]::FromImage($webImage)
  $webGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $webGraphics.DrawImage($output, 0, 0, 1600, 1600)
  $webImage.Save($path, $jpegCodec, $jpegParameters)
  $manifest += [ordered]@{
    code = $item.code; category = $item.category
    width = $dimensions[0]; height = $dimensions[1]; gusset = $dimensions[2]
    src = '/size-guides/' + $filename + '?v=' + (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.Substring(0,12).ToLowerInvariant()
    colors = @($item.colors)
  }
  $webGraphics.Dispose(); $webImage.Dispose(); $graphics.Dispose(); $output.Dispose(); $photo.Dispose(); $categoryBrush.Dispose()
}
[System.IO.File]::WriteAllText($manifestPath, ((ConvertTo-Json -InputObject $manifest -Depth 5) + [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))
$rulers.Dispose(); $rulerStream.Dispose(); $archive.Dispose(); $fonts.Dispose()
$headingFont.Dispose(); $captionFont.Dispose(); $measureFont.Dispose(); $a4Font.Dispose()
$dark.Dispose(); $gray.Dispose(); $measurementBrush.Dispose(); $depthBrush.Dispose(); $format.Dispose(); $center.Dispose()
$paperBorder.Dispose(); $foldBrush.Dispose(); $dotOutline.Dispose(); $dimensionPen.Dispose(); $extensionPen.Dispose(); $arrow.Dispose(); $jpegParameters.Dispose()
Write-Output ('Added models 06680 and 10740; gallery now contains ' + $manifest.Count + ' guides')
