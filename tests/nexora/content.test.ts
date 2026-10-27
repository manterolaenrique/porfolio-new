import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, parse } from "groq-js";
import {
  NEXORA_QUERY,
  normalizeNexoraProjects,
} from "../../src/services/nexora/query";
import type { NexoraProject } from "../../src/domain/nexora";

test("GROQ resolves linked technical data once, supports standalone and ignores stale linked copies", async () => {
  const documents = [
    {
      _id: "asset-1",
      _type: "sanity.imageAsset",
      url: "https://cdn.sanity.io/shared.png",
    },
    {
      _id: "asset-2",
      _type: "sanity.imageAsset",
      url: "https://cdn.sanity.io/standalone.png",
    },
    {
      _id: "technical",
      _type: "project",
      thumbnail: { asset: { _ref: "asset-1" } },
      technologies: ["Next.js"],
      demoUrl: "https://real.example",
      devicePreviews: { mobile: { asset: { _ref: "asset-1" } } },
    },
    {
      _id: "linked",
      _type: "nexoraProject",
      slug: { current: "linked" },
      technicalProject: { _ref: "technical" },
      standalone: {
        technologies: ["Stale copy"],
        thumbnail: { asset: { _ref: "asset-2" } },
      },
    },
    {
      _id: "independent",
      _type: "nexoraProject",
      slug: { current: "independent" },
      standalone: {
        technologies: ["TypeScript"],
        thumbnail: { asset: { _ref: "asset-2" } },
      },
    },
    {
      _id: "broken",
      _type: "nexoraProject",
      slug: { current: "broken" },
      technicalProject: { _ref: "missing" },
    },
  ];
  async function query() {
    return await (
      await evaluate(parse(NEXORA_QUERY), { dataset: documents })
    ).get();
  }
  const initial = await query();
  assert.equal(initial.projects.length, 2);
  const linked = initial.projects.find(
    (item: { id: string }) => item.id === "linked",
  );
  assert.equal(linked.image, "https://cdn.sanity.io/shared.png");
  assert.deepEqual(linked.technologies, ["Next.js"]);
  assert.equal(linked.mobileImage, linked.image);
  assert.equal(
    initial.projects.find((item: { id: string }) => item.id === "independent")
      .image,
    "https://cdn.sanity.io/standalone.png",
  );
  documents[2].technologies = ["React", "TypeScript"];
  assert.deepEqual(
    (await query()).projects.find(
      (item: { id: string }) => item.id === "linked",
    ).technologies,
    ["React", "TypeScript"],
  );
});
test("invalid recommendations are not exposed; projects without an image are excluded", () => {
  const content = normalizeNexoraProjects([
    {
      slug: "valid",
      image: "/real.png",
      recommendation: { text: " ", author: "Someone" },
    },
    {
      slug: "recommended",
      image: "/real.png",
      recommendation: { text: "Una recomendación real", author: "Cliente" },
    },
    { slug: "no-image" },
  ] as NexoraProject[]);
  assert.equal(content.length, 2);
  assert.equal(content[0].recommendation, undefined);
  assert.equal(content[1].recommendation?.author, "Cliente");
  assert.deepEqual(content[0].technologies, []);
});
