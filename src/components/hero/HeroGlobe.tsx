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
                // Using Natural Earth data from a CDN
                const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
                const world: any = await response.json()
                const countries = (feature(world, world.objects.countries) as any).features
                setWorldData(countries)
            } catch (error) {
                console.log("Error loading world data:", error)
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

        // Cache the selection to avoid re-querying DOM every frame
        const allPaths = globeGroup.selectAll("path");

        // Animation Timer
        const timer = d3.timer((elapsed) => {
            // Speed factor: 0.01 (slower, smoother)
            // Constant velocity based on time
            const rotate = [elapsed * 0.01, -15]
            projection.rotate(rotate as [number, number])

            // Update paths efficiently
            allPaths.attr("d", path as any)
        })

        return () => {
            timer.stop()
        }
    }, [worldData, dimensions])

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 md:opacity-50 z-0 overflow-hidden">
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                className="max-w-none"
            // style={{ mixBlendMode: 'overlay' }} // Removed to fix dark mode visibility
            />
        </div>
    )
}
