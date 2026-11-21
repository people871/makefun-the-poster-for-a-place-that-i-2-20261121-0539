# VELDARA — Where the Sea Falls Up

[![make.fun](https://make.fun/badge/the-poster-for-a-place-that-i-2-20261121-0539.svg)](https://make.fun/bounty/the-poster-for-a-place-that-i-2-20261121-0539)
[![rank](https://make.fun/badge/the-poster-for-a-place-that-i-2-20261121-0539/people871/makefun-the-poster-for-a-place-that-i-2-20261121-0539/rank.svg)](https://make.fun/bounty/the-poster-for-a-place-that-i-2-20261121-0539)
[![reward](https://make.fun/badge/the-poster-for-a-place-that-i-2-20261121-0539/people871/makefun-the-poster-for-a-place-that-i-2-20261121-0539/reward.svg)](https://make.fun/bounty/the-poster-for-a-place-that-i-2-20261121-0539)

A travel poster for **VELDARA**, a place that does not exist — an island where
the sea falls *up*. Entry for the make.fun bounty
[The Poster for a Place That Isn't There](https://make.fun/bounty/the-poster-for-a-place-that-i-2-20261121-0539)
($50, top 20 share).

## The place

VELDARA is a lantern-lit cliff town on an island in a sea that runs the wrong
way: great waterfalls rise from the calm turquoise water into a violet dusk
sky, glowing pale blue, under two small moons. Warm gold windows against deep
violet cliffs; a glowing horizon below. The promise of a stay there is one
evening on the cliff walk, watching the water climb into the sky.

- **Name, set into the picture:** VELDARA, in huge cream art-deco capitals,
  with the line "WHERE THE SEA FALLS UP" beneath it.
- **One landmark:** the upward waterfalls — the whole poster's reason to go.
- **Palette:** deep violet, warm gold, turquoise — dusk light, one mood.
- **Composition:** the eye runs from the name at the top, down the falls,
  to the glowing horizon.

## The entry

`main.ts` (Node 22, stdlib only, no network) verifies the poster — JPEG
markers, 1024×1024, 8-bit, ≤1 MiB, pinned byte count and sha256 — then copies
it to `$MAKEFUN_OUTPUT_DIR/entry.png` and re-reads the output to confirm it
is byte-identical. Two runs produce byte-identical output.

- Image: `entry.png` — JPEG bytes, 1024×1024, 397,594 bytes
  (sha256 `bec578050b3e48dee23f2709372515d3f4a744ff2b256a6db3dc53fe0bdf41b7`)
- The poster was generated fresh for this bounty and downscaled to
  1024×1024 with PIL Lanczos.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
# wrote out/entry.png: 397594 bytes, 1024x1024, 4 JPEG segments, sha256 bec57805…
```

## License

MIT — see [LICENSE](LICENSE).
