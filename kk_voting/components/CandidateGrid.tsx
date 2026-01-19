"use client";

import { useEffect, useRef } from "react";
import CandidateCard from "./CandidateCard";

type Candidate = {
    id: string;
    full_name: string;
    city: string;
    short_description: string;
    photo_url: string | null;
    is_wide: boolean;
    category_id: string;
};

export default function CandidateGrid({
                                          candidates,
                                          categoryTitle,
                                      }: {
    candidates: Candidate[];
    categoryTitle: string;
}) {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let pckryInstance: any = null;

        const initGrid = async () => {
            if (!gridRef.current) return;

            // 1. Dynamically import and CAST TO ANY
            // This fixes the "This expression is not constructable" error
            const Packery = (await import("packery")).default as any;
            const imagesLoaded = (await import("imagesloaded")).default as any;

            // 2. Initialize Packery
            pckryInstance = new Packery(gridRef.current, {
                itemSelector: ".grid-item",
                columnWidth: ".grid-sizer",
                percentPosition: true,
                gutter: 0,
            });

            // 3. Bind imagesLoaded
            const imgLoad = imagesLoaded(gridRef.current);

            imgLoad.on("progress", () => {
                pckryInstance.layout();
            });
        };

        initGrid();

        return () => {
            if (pckryInstance) {
                pckryInstance.destroy();
            }
        };
    }, [candidates]);

    return (
        <div ref={gridRef} className="-mx-4">
            <div className="grid-sizer w-full md:w-1/2 lg:w-1/3" />

            {candidates.map((c) => (
                <div
                    key={c.id}
                    className={`
            grid-item p-4 
            w-full 
            md:w-1/2 
            ${c.is_wide ? "lg:w-2/3" : "lg:w-1/3"} 
          `}
                >
                    <CandidateCard
                        id={c.id}
                        name={c.full_name}
                        city={c.city}
                        shortDescription={c.short_description}
                        photoUrl={c.photo_url}
                        categoryTitle={categoryTitle}
                        featured={c.is_wide}
                    />
                </div>
            ))}
        </div>
    );
}