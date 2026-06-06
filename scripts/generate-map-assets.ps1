Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets\maps"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function New-Pen($hex, $width) {
  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $width
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  return $pen
}

function Add-Label($g, $text, $x, $y, $size, $color = "#6E685F") {
  $font = New-Object System.Drawing.Font("Georgia", $size, [System.Drawing.FontStyle]::Bold)
  $brush = New-Brush $color
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x - 220, $y, 440, 42), $format)
  $font.Dispose()
  $brush.Dispose()
  $format.Dispose()
}

function Add-Texture($g, $seed) {
  $rand = New-Object System.Random($seed)
  for ($i = 0; $i -lt 1700; $i++) {
    $alpha = 15 + $rand.Next(20)
    $color = [System.Drawing.Color]::FromArgb($alpha, 70, 64, 54)
    $pen = New-Object System.Drawing.Pen($color, 1)
    $x = $rand.Next(0, 1600)
    $y = $rand.Next(0, 1200)
    $g.DrawLine($pen, $x, $y, $x + $rand.Next(-10, 12), $y + $rand.Next(-5, 7))
    $pen.Dispose()
  }
}

function Fill-Polygon($g, $points, $fill, $stroke = "#D7CDBE", $width = 3) {
  $brush = New-Brush $fill
  $pen = New-Pen $stroke $width
  $g.FillPolygon($brush, $points)
  $g.DrawPolygon($pen, $points)
  $brush.Dispose()
  $pen.Dispose()
}

function Draw-Map($name, $labels, $seed, $variant) {
  $bitmap = New-Object System.Drawing.Bitmap(1600, 1200)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $sea = New-Brush "#D8E0DF"
  $g.FillRectangle($sea, 0, 0, 1600, 1200)
  $sea.Dispose()

  $coastPen = New-Pen "#BFC9C3" 2
  for ($i = 0; $i -lt 12; $i++) {
    $offset = $i * 42
    $g.DrawBezier($coastPen, -120 + $offset, 980, 160 + $offset, 850, 320 + $offset, 1090, 620 + $offset, 930)
  }
  $coastPen.Dispose()

  if ($variant -eq "patriarchs") {
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(1040, 110), [System.Drawing.Point]::new(1310, 250), [System.Drawing.Point]::new(1260, 565),
      [System.Drawing.Point]::new(1040, 710), [System.Drawing.Point]::new(820, 890), [System.Drawing.Point]::new(650, 1035),
      [System.Drawing.Point]::new(470, 930), [System.Drawing.Point]::new(540, 675), [System.Drawing.Point]::new(670, 420),
      [System.Drawing.Point]::new(800, 225)
    ) "#E9DDC5"
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(420, 310), [System.Drawing.Point]::new(735, 238), [System.Drawing.Point]::new(880, 430),
      [System.Drawing.Point]::new(800, 765), [System.Drawing.Point]::new(600, 1030), [System.Drawing.Point]::new(360, 865),
      [System.Drawing.Point]::new(290, 570)
    ) "#D9DEC8" "#CCD3BD" 2
    Add-Label $g "UPPER MESOPOTAMIA" 1110 190 24 "#7B6E5E"
    Add-Label $g "CANAAN" 700 775 28 "#686B58"
    Add-Label $g "NEGEV" 590 960 20 "#877762"
  } elseif ($variant -eq "exodus") {
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(170, 150), [System.Drawing.Point]::new(620, 130), [System.Drawing.Point]::new(705, 470),
      [System.Drawing.Point]::new(520, 780), [System.Drawing.Point]::new(210, 875), [System.Drawing.Point]::new(80, 540)
    ) "#E5D9BE"
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(760, 260), [System.Drawing.Point]::new(1260, 340), [System.Drawing.Point]::new(1430, 790),
      [System.Drawing.Point]::new(1110, 1070), [System.Drawing.Point]::new(720, 900), [System.Drawing.Point]::new(650, 565)
    ) "#DCD8BD" "#CDC7AA" 2
    $water = New-Brush "#BFD0D4"
    $g.FillPie($water, 520, 280, 320, 780, 95, 180)
    $water.Dispose()
    Add-Label $g "EGYPT" 350 425 30 "#7E705E"
    Add-Label $g "SINAI" 800 720 27 "#696B57"
    Add-Label $g "MIDIAN" 1130 770 25 "#74705D"
  } elseif ($variant -eq "ministry") {
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(650, 80), [System.Drawing.Point]::new(980, 125), [System.Drawing.Point]::new(1090, 380),
      [System.Drawing.Point]::new(980, 720), [System.Drawing.Point]::new(860, 1060), [System.Drawing.Point]::new(620, 1090),
      [System.Drawing.Point]::new(500, 770), [System.Drawing.Point]::new(540, 385)
    ) "#E4D8BD"
    $lake = New-Brush "#B8CED0"
    $g.FillEllipse($lake, 760, 285, 165, 245)
    $g.FillEllipse($lake, 700, 715, 210, 390)
    $lake.Dispose()
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(980, 160), [System.Drawing.Point]::new(1280, 260), [System.Drawing.Point]::new(1325, 750),
      [System.Drawing.Point]::new(1035, 965), [System.Drawing.Point]::new(920, 680), [System.Drawing.Point]::new(1080, 390)
    ) "#D8DCC5" "#C9CEB6" 2
    Add-Label $g "GALILEE" 770 235 27 "#686B58"
    Add-Label $g "SAMARIA" 760 560 22 "#827462"
    Add-Label $g "JUDEA" 740 870 26 "#7B705F"
    Add-Label $g "JORDAN" 1030 610 22 "#6D756B"
  } else {
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(510, 120), [System.Drawing.Point]::new(1000, 150), [System.Drawing.Point]::new(1280, 390),
      [System.Drawing.Point]::new(1180, 710), [System.Drawing.Point]::new(910, 960), [System.Drawing.Point]::new(620, 1090),
      [System.Drawing.Point]::new(420, 820), [System.Drawing.Point]::new(440, 470)
    ) "#E5D9BE"
    Fill-Polygon $g @(
      [System.Drawing.Point]::new(980, 170), [System.Drawing.Point]::new(1430, 260), [System.Drawing.Point]::new(1500, 700),
      [System.Drawing.Point]::new(1210, 945), [System.Drawing.Point]::new(1010, 705), [System.Drawing.Point]::new(1120, 390)
    ) "#DADDC5" "#C8CEB8" 2
    Add-Label $g "SYRIA" 1060 260 29 "#686B58"
    Add-Label $g "JUDEA" 720 815 25 "#7B705F"
    Add-Label $g "DAMASCUS ROAD" 940 490 20 "#827462"
  }

  Add-Texture $g $seed

  $borderPen = New-Pen "#B58C5A" 4
  $borderPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
  $g.DrawRectangle($borderPen, 38, 38, 1524, 1124)
  $borderPen.Dispose()

  $titleFont = New-Object System.Drawing.Font("Georgia", 42, [System.Drawing.FontStyle]::Bold)
  $titleBrush = New-Brush "#333333"
  $g.DrawString($labels.title, $titleFont, $titleBrush, 70, 70)
  $titleFont.Dispose()
  $titleBrush.Dispose()

  $subtitleFont = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular)
  $subtitleBrush = New-Brush "#73706B"
  $g.DrawString($labels.subtitle, $subtitleFont, $subtitleBrush, 72, 124)
  $subtitleFont.Dispose()
  $subtitleBrush.Dispose()

  $bitmap.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bitmap.Dispose()
}

Draw-Map "patriarchs.png" @{ title = "Patriarchs"; subtitle = "Abram's route into Canaan" } 12 "patriarchs"
Draw-Map "exodus.png" @{ title = "Exodus"; subtitle = "Moses, Midian, and Horeb" } 34 "exodus"
Draw-Map "ministry.png" @{ title = "Ministry"; subtitle = "Galilee, Jordan, and Judea" } 56 "ministry"
Draw-Map "paul-journeys.png" @{ title = "Acts"; subtitle = "Jerusalem toward Damascus" } 78 "paul"

Write-Output "Generated map assets in $outDir"
