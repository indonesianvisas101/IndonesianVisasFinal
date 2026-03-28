"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
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
                const response = await fetch("/world-110m.json")
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

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        // Config
        const projection = d3.geoOrthographic()
            .scale(dimensions.width / 2.5) // Adjust scale based on view
            .translate([dimensions.width / 2, dimensions.height / 2])
            .precision(0.1)

        const path = d3.geoPath(projection)

        // Graticule
        const graticule = d3.geoGraticule()

        // Elements
        const globeGroup = svg.append("g")

        // 1. Sphere Fill (Ocean) - Transparent or slight blue? User said "without a background"
        // But usually a globe has a "water" sphere. 
        // "without a background" likely means the rectangular container is transparent.
        // I'll add a subtle sphere fill to make it look like a globe, but keep it minimal as per "Hero Background".
        // Actually, let's keep it transparent but with a faint stroke.

        // 2. Graticule
        globeGroup.append("path")
            .datum(graticule())
            .attr("d", path as any)
            .attr("fill", "none")
            .attr("stroke", "var(--primary)") // Adaptive Color
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 0.5)

        // 3. Countries
        const countriesPath = globeGroup.selectAll(".country")
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

        // 5. Bali Marker
        const baliCoords: [number, number] = [115.1889, -8.4095]
        
        // Marker container
        const markerGroup = globeGroup.append("g")
            .attr("class", "bali-marker")

        // Outer pulse circle
        const pulseCircle = markerGroup.append("circle")
            .attr("r", 8)
            .attr("fill", "#ff0000")
            .attr("fill-opacity", 0.4)
            .attr("class", "pulse-animation")

        // Inner solid dot
        const innerDot = markerGroup.append("circle")
            .attr("r", 3)
            .attr("fill", "#ff0000")

        // Cache the selection to avoid re-querying DOM every frame
        const allPaths = globeGroup.selectAll("path");

        // Efficient Animation Loop (Throttled to 30fps)
        let frameCount = 0;
        const timer = d3.timer((elapsed) => {
            frameCount++;
            if (frameCount % 2 !== 0) return; // Skip every other frame (30fps target)

            const rotate = [elapsed * 0.01, -15];
            projection.rotate(rotate as [number, number]);

            // Single update call for all paths
            allPaths.attr("d", path as any);

            // Update Bali Marker Position
            const projectedBali = projection(baliCoords);
            if (projectedBali) {
                const center = projection.invert!([dimensions.width / 2, dimensions.height / 2]);
                const distance = d3.geoDistance(baliCoords, center!);
                
                if (distance < Math.PI / 2) {
                    markerGroup.style("opacity", 1);
                    markerGroup.attr("transform", `translate(${projectedBali[0]}, ${projectedBali[1]})`);
                } else {
                    markerGroup.style("opacity", 0);
                }
            } else {
                markerGroup.style("opacity", 0);
            }
        });

        return () => {
            timer.stop()
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
            // style={{ mixBlendMode: 'overlay' }} // Removed to fix dark mode visibility
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
