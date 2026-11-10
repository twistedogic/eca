# Chart patterns

Patterns are the shapes price makes around the levels of chapter 2. Every
named pattern is a compressed story about support and resistance: which
side is losing ground, where the decision point sits, and what the shape
implies if it completes. This chapter covers the classics in two families
— reversals and continuations — and then the uncomfortable statistics
about trading them.

## Three families

A **chart pattern** is a recognizable price formation that traders read as
information about the likely next move. Patterns sort into three
temperaments:

- A **reversal pattern** marks the exhaustion of a trend and implies the
  next move goes the other way.
- A **continuation pattern** is a pause that consolidates the trend and
  implies it resumes.
- A **bilateral pattern** is an honest shrug: it narrows the possibilities
  and says trade the break, whichever side it comes from.

The category tells you what to prepare for, not what will happen. A
pattern that fails is itself information — a failed breakdown is often the
strongest bullish signal in the chapter.

## Reversal patterns

### Head and shoulders

The **head and shoulders** is the classic top: three peaks, the middle one
highest, all standing on a shared floor called the **neckline** — the
support line drawn along the two troughs between the peaks. The pattern
completes when price closes below the neckline; that break is the signal,
not the shape.

<svg width="640" viewBox="0 0 640 240" role="img" aria-label="Head and shoulders: three peaks with the middle highest, standing on a dashed neckline that price breaks downward" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="170" x2="610" y2="170" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="7 5"/>
  <text x="520" y="162" font-size="14" fill="var(--muted)">neckline</text>
  <polyline points="40,180 100,80 160,170 320,30 480,170 540,85 590,200" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
  <text x="100" y="60" font-size="14" fill="var(--muted)" text-anchor="middle">shoulder</text>
  <text x="320" y="20" font-size="14" fill="var(--ink)" text-anchor="middle">head</text>
  <text x="540" y="65" font-size="14" fill="var(--muted)" text-anchor="middle">shoulder</text>
  <text x="595" y="220" font-size="14" fill="var(--bad)" text-anchor="end">break confirms the reversal</text>
</svg>

### Double top and double bottom

A **double top** is two rallies to the same ceiling with a trough between
them; it completes when price closes below that trough. Buyers failed
twice at the same price — the second failure is the argument that they are
done. A **double bottom** is the exact mirror at a floor: two declines
rejected at the same support, confirmed by a close above the peak between
them.

<svg width="640" viewBox="0 0 640 220" role="img" aria-label="Left: a double top with two peaks at the same resistance and a break below the trough. Right: a double bottom with two troughs at the same support and a break above the peak" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="70" x2="290" y2="70" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text x="165" y="58" font-size="14" fill="var(--accent)" text-anchor="middle">same ceiling, failed twice</text>
  <polyline points="40,140 90,72 150,150 210,72 265,160 310,200" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
  <text x="80" y="215" font-size="14" fill="var(--bad)">double top</text>
  <line x1="370" y1="160" x2="620" y2="160" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text x="495" y="182" font-size="14" fill="var(--accent)" text-anchor="middle">same floor, rejected twice</text>
  <polyline points="350,90 400,158 460,80 520,158 575,75 620,40" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
  <text x="400" y="215" font-size="14" fill="var(--ok)">double bottom</text>
</svg>

## Continuation patterns

### Triangles

A **triangle** is a convergence: price coils between a falling line of
lower highs and a rising line of higher lows until the coils meet. An
**ascending triangle** has a flat ceiling and rising lows — buyers chipping
at a known price; a **descending triangle** has a flat floor and falling
highs; a **symmetrical triangle** converges from both sides and is the
honest bilateral: trade the break, pick no side in advance.

<svg width="640" viewBox="0 0 640 210" role="img" aria-label="Three small panels: an ascending triangle with a flat top and rising lows, a descending triangle with a flat bottom and falling highs, and a symmetrical triangle converging from both sides" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="60" x2="200" y2="60" stroke="var(--bad)" stroke-width="2"/>
  <polyline points="20,150 60,120 100,130 140,95 180,105 198,62" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text x="110" y="190" font-size="14" fill="var(--muted)" text-anchor="middle">ascending — buyers pressing</text>
  <line x1="240" y1="150" x2="420" y2="150" stroke="var(--ok)" stroke-width="2"/>
  <polyline points="240,60 280,90 320,80 360,115 400,105 418,148" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text x="330" y="190" font-size="14" fill="var(--muted)" text-anchor="middle">descending — sellers pressing</text>
  <line x1="460" y1="50" x2="620" y2="115" stroke="var(--muted)" stroke-width="2"/>
  <line x1="460" y1="160" x2="620" y2="100" stroke="var(--muted)" stroke-width="2"/>
  <polyline points="465,105 500,62 540,100 580,90 610,108" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text x="540" y="190" font-size="14" fill="var(--muted)" text-anchor="middle">symmetrical — bilateral</text>
</svg>

### Wedges and flags

A **wedge** is a triangle whose two boundary lines slope the same way. A
**rising wedge** climbs on shrinking energy — higher lows arrive faster
than higher highs — and typically resolves downward; a falling wedge is
the mirror. A **flag** is a small, tight channel that slopes against a
steep prior move, as if the market catches its breath before continuing;
a **pennant** is the same pause drawn as a tiny symmetric triangle.

<svg width="640" viewBox="0 0 640 220" role="img" aria-label="Left: a rising wedge with two upward-sloping converging lines and price breaking down from it. Right: a flag with a steep pole, a small downward-sloping consolidation channel, then continuation upward" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="170" x2="270" y2="80" stroke="var(--muted)" stroke-width="2"/>
  <line x1="20" y1="110" x2="270" y2="70" stroke="var(--muted)" stroke-width="2"/>
  <polyline points="25,150 70,120 110,140 150,110 190,125 225,95 250,90 290,150" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
  <text x="140" y="205" font-size="14" fill="var(--muted)" text-anchor="middle">rising wedge — breaks down</text>
  <polyline points="330,200 420,60" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
  <line x1="420" y1="60" x2="480" y2="95" stroke="var(--muted)" stroke-width="2"/>
  <line x1="435" y1="45" x2="495" y2="80" stroke="var(--muted)" stroke-width="2"/>
  <polyline points="422,62 445,50 455,72 472,62 480,84 492,76" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <polyline points="495,78 610,30" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
  <text x="380" y="205" font-size="14" fill="var(--muted)" text-anchor="middle">flag — pause, then continue</text>
  <text x="520" y="25" font-size="14" fill="var(--ok)">continuation</text>
</svg>

## Reading patterns without worshipping them

Three habits keep patterns honest:

- Confirmation is the close. Every pattern in this chapter completes
  on a close beyond its boundary — neckline, trough, or boundary line.
  The shape alone is a hypothesis; the break is the event.
- Targets are measured. The classic **measured move** projects the
  pattern's height from the breakout point — head-to-neckline for head
  and shoulders, trough depth for a double top. It is a first estimate
  for where to take profit, not a promise.
- Location outranks shape. The same triangle at the third test of
  major resistance means more than a picture-perfect one in the middle of
  nowhere.

> A pattern's completion is the close beyond its boundary — until then it
> is a hypothesis; the **measured move** projects its height from the
> break as a first target, not a forecast.

And the standing limit: pattern studies across decades of data find real
but modest edge, far short of the folklore. Patterns describe pressure.
They do not oblige the future — which is why the stop belongs just inside
the pattern, where its completion is proven wrong.
