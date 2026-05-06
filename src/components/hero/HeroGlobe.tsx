"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { select, timer as d3Timer, geoOrthographic, geoPath, geoGraticule, geoDistance } from "d3"
import { feature } from "topojson-client"

interface GeoFeature {
    type: string
    geometry: any
    properties: any
}

export default function HeroGlobe() {
    const svgRef = useRef<SVGSVGElement>(null)
    const [worldData, setWorldData] = useState<GeoFeature[]>([])

    // Dimensions
    const [dimensions, setDimensions] = useState({ width: 800, height: 800 })

    // Load world data
    useEffect(() => {
        const loadWorldData = async () => {
            try {
                // Pre-warm the fetch with priority
                const response = await fetch("/world-110m.json", { priority: 'low' } as any)
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const world: any = await response.json()
                const countries = (feature(world, world.objects.countries) as any).features
                setWorldData(countries)
            } catch (error) {
                // Silently fail or log to telemetry in production
            }
        }

        loadWorldData()

        // Responsive dimensions
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDimensions({ width: window.innerWidth, height: 500 })
            } else {
                setDimensions({ width: 1000, height: 1000 })
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Animation Loop
    useEffect(() => {
        if (!svgRef.current || worldData.length === 0) return

        const svg = select(svgRef.current)
        svg.selectAll("*").remove()

        // Config
        const projection = geoOrthographic()
            .scale(dimensions.width / 2.5) // Adjust scale based on view
            .translate([dimensions.width / 2, dimensions.height / 2])
            .precision(0.1)

        const path = geoPath(projection)

        // Graticule
        const graticule = geoGraticule()

        // Elements
        const globeGroup = svg.append("g")

        // 2. Graticule
        globeGroup.append("path")
            .datum(graticule())
            .attr("d", path as any)
            .attr("fill", "none")
            .attr("stroke", "var(--primary)") // Adaptive Color
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 0.5)

        // 3. Countries
        globeGroup.selectAll(".country")
            .data(worldData)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path as any)
            .attr("fill", "var(--text-secondary)")
            .attr("fill-opacity", 0.05)
            .attr("stroke", "var(--primary-dark)")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", 0.8)

        // 4. Sphere Outline
        globeGroup.append("path")
            .datum({ type: "Sphere" })
            .attr("d", path as any)
            .attr("fill", "none")
            .attr("stroke", "var(--primary)")
            .attr("stroke-opacity", 0.2)
            .attr("stroke-width", 1)

        // 5. Regional Markers
        const markers = [
            { name: "Bali", coords: [115.1889, -8.4095] as [number, number] },
            { name: "Jakarta", coords: [106.8456, -6.2088] as [number, number] },
            { name: "Europe", coords: [-0.1278, 51.5074] as [number, number] }, // London
            { name: "USA", coords: [-74.0060, 40.7128] as [number, number] }    // NYC
        ]
        
        // Marker containers
        const markerGroups = globeGroup.selectAll(".marker")
            .data(markers)
            .enter()
            .append("g")
            .attr("class", "marker")

        // Outer pulse circles
        markerGroups.append("circle")
            .attr("r", (d) => d.name === "Bali" || d.name === "Jakarta" ? 8 : 4)
            .attr("fill", "var(--primary)")
            .attr("fill-opacity", 0.4)
            .attr("class", "pulse-animation")

        // Inner solid dots
        markerGroups.append("circle")
            .attr("r", (d) => d.name === "Bali" || d.name === "Jakarta" ? 3 : 1.5)
            .attr("fill", "var(--primary)")

        // Cache the selection to avoid re-querying DOM every frame
        const allPaths = globeGroup.selectAll("path");

        // Efficient Animation Loop (Throttled to 30fps)
        let frameCount = 0;
        const mainTimer = d3Timer((elapsed: number) => {
            frameCount++;
            if (frameCount % 2 !== 0) return; // Skip every other frame (30fps target)

            const rotate = [elapsed * 0.01, -15];
            projection.rotate(rotate as [number, number]);

            // Single update call for all paths
            allPaths.attr("d", path as any);

            // Update All Markers
            markerGroups.each(function(d) {
                const projected = projection(d.coords);
                const selection = select(this);
                
                if (projected) {
                    const center = projection.invert!([dimensions.width / 2, dimensions.height / 2]);
                    const distance = geoDistance(d.coords, center!);
                    
                    if (distance < Math.PI / 2) {
                        selection.style("opacity", 1);
                        selection.attr("transform", `translate(${projected[0]}, ${projected[1]})`);
                    } else {
                        selection.style("opacity", 0);
                    }
                } else {
                    selection.style("opacity", 0);
                }
            });
        });

        return () => {
            mainTimer.stop()
        }
    }, [worldData, dimensions])

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 md:opacity-80 z-0 overflow-hidden">
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                className="max-w-none"
            />
            <style jsx>{`
                @keyframes pulse-marker {
                    0% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(3); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
                .pulse-animation {
                    animation: pulse-marker 2s ease-out infinite;
                    transform-origin: center;
                }
            `}</style>
        </div>
    )
}
