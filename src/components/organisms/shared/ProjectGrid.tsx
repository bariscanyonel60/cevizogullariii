"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import type { Project, ProjectCategory } from "@/types";

const categories: { value: "" | ProjectCategory; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "dis-cephe", label: "Dış Cephe" },
  { value: "yapi", label: "Yapı / Şantiye" },
  { value: "konut", label: "Konut" },
  { value: "ticari", label: "Ticari" },
];

export function ProjectGrid({ items }: { items: Project[] }) {
  const [category, setCategory] = useState<"" | ProjectCategory>("");

  const filtered = useMemo(
    () => items.filter((p) => !category || p.category === category),
    [items, category],
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c.value
                ? "bg-forest-800 text-white"
                : "bg-white text-ink-700 shadow-sm hover:bg-forest-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {filtered.map((project, index) => (
          <div key={project.id} className="mb-5 break-inside-avoid">
            <ProjectCard project={project} tall={index % 3 === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
