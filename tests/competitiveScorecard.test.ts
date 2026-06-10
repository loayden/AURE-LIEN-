import assert from "node:assert/strict";
import test from "node:test";

import { competitiveScores, editorialAssets, qualityGates, scoreFields } from "@/lib/competitiveScorecard";

test("competitive scorecard keeps all scores in a 1-10 range", () => {
  for (const score of competitiveScores) {
    for (const field of scoreFields) {
      assert.ok(score[field] >= 1, `${score.competitor} ${field} is below 1`);
      assert.ok(score[field] <= 10, `${score.competitor} ${field} is above 10`);
    }
  }
});

test("competitive scorecard includes the main Egypt fashion competitors", () => {
  const names = competitiveScores.map((score) => score.competitor);

  assert.ok(names.includes("Amazon Egypt"));
  assert.ok(names.includes("Noon"));
  assert.ok(names.includes("Shein"));
  assert.ok(names.includes("Jumia Egypt"));
  assert.ok(names.includes("Zara"));
});

test("competitive scorecard uses documented editorial assets", () => {
  assert.ok(editorialAssets.length >= 3);
  assert.ok(editorialAssets.some((asset) => asset.source === "pexels"));
  assert.ok(editorialAssets.every((asset) => asset.alt.length > 20));
  assert.ok(editorialAssets.every((asset) => asset.credit.length > 4));
});

test("competitive scorecard defines a 10/10 gate for every critical area", () => {
  const areas = qualityGates.map((gate) => gate.area);

  for (const expectedArea of ["UI/UX", "Frontend", "Backend", "Database", "Admin", "Product", "Security"]) {
    assert.ok(areas.includes(expectedArea as (typeof qualityGates)[number]["area"]));
  }

  assert.ok(qualityGates.every((gate) => gate.target === "10/10"));
});
