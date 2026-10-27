import { cache } from "react";
import { createClient } from "@sanity/client";
import type {
  NexoraContent,
  NexoraProject,
  NexoraService,
  NexoraSettings,
} from "@/domain/nexora";
import {
  defaultServices,
  defaultSettings,
  developmentProjects,
} from "./defaults";
import { NEXORA_QUERY, normalizeNexoraProjects } from "./query";

export const getNexoraContent = cache(async (): Promise<NexoraContent> => {
  const demoAllowed =
    process.env.NEXORA_ALLOW_DEMO_DATA === "true" &&
    process.env.NEXT_PUBLIC_SANITY_DATASET === "development";
  try {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_SANITY_DATASET !== "development"
    )
      throw new Error("Nexora DEV requires development dataset");
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
      useCdn: false,
      perspective: "published",
      token: process.env.SANITY_READ_TOKEN,
      timeout: 8000,
      maxRetries: 0,
    });
    const content = await client.fetch<{
      settings: Partial<NexoraSettings> | null;
      services: NexoraService[];
      projects: NexoraProject[];
    }>(
      NEXORA_QUERY,
      {},
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: ["nexora"] } },
    );
    return {
      settings: { ...defaultSettings, ...content.settings },
      services: content.services || [],
      projects: normalizeNexoraProjects(content.projects || []),
      source: "sanity",
    };
  } catch {
    return {
      settings: defaultSettings,
      services: defaultServices,
      projects: demoAllowed ? developmentProjects : [],
      source: demoAllowed ? "development-snapshot" : "empty",
    };
  }
});
export async function getNexoraProject(slug: string) {
  return (
    (await getNexoraContent()).projects.find(
      (project) => project.slug === slug,
    ) || null
  );
}
