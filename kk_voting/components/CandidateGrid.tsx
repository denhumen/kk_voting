"use client";

import { useEffect, useRef } from "react";
import CandidateCard from "./CandidateCard";

// Note: We REMOVED the top-level imports for "packery" and "imagesloaded"
// to prevent the "window is not defined" server error.

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

        // We define an async function to load libraries only on the client
        const initGrid = async () => {
            if (!gridRef.current) return;

            // 1. Dynamically import the libraries
            // This ensures they are NOT loaded on the server
            const Packery = (await import("packery")).default;
            const imagesLoaded = (await import("imagesloaded")).default;

            // 2. Initialize Packery
            pckryInstance = new Packery(gridRef.current, {
                itemSelector: ".grid-item",
                columnWidth: ".grid-sizer",
                percentPosition: true,
                gutter: 0,
            });

            // 3. Bind imagesLoaded
            // "packery" type definitions can be tricky with dynamic imports,
            // so we cast imagesLoaded as any to avoid TS errors if necessary.
            const imgLoad = (imagesLoaded as any)(gridRef.current);

            imgLoad.on("progress", () => {
                // Force re-layout as each image loads
                pckryInstance.layout();
            });
        };

        // Run the initialization
        initGrid();

        // Cleanup when candidates change or component unmounts
        return () => {
            if (pckryInstance) {
                pckryInstance.destroy();
            }
        };
    }, [candidates]);

    return (
        <div ref={gridRef} className="-mx-4">
            {/* SIZER: Defines 1 column width */}
            {/* Mobile: 100%, Tablet: 50%, Desktop: 33.333% */}
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