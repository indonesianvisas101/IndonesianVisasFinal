"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Box, Typography, Button, ButtonGroup, useTheme } from '@mui/material';
import * as d3 from 'd3';

export default function RevenueChart() {
    const theme = useTheme();
    const [period, setPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('30d');
    const [data, setData] = useState<{ date: Date; amount: number; count: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ revenue: 0, transactions: 0 });
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        fetchData();
    }, [period]);

    // Resize Observer for D3
    useEffect(() => {
        const handleResize = () => drawChart();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data, theme.palette.mode]);

    // Draw Chart when data changes
    useEffect(() => {
        if (data.length > 0 && !loading) {
            drawChart();
        }
    }, [data, loading, theme.palette.mode]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/invoices?isAdmin=true');
            if (!res.ok) throw new Error("Failed to fetch");
            const invoices: any[] = await res.json();

            const paidInvoices = invoices.filter((i: any) => i.status === 'PAID');

            // --- FILTER LOGIC ---
            // "Start The Progress on 1 October 2024" (Project Start)
            const PROJECT_START = new Date('2024-10-01');
            const now = new Date();
            let startDate = new Date();

            if (period === '30d') startDate.setDate(now.getDate() - 30);
            else if (period === '90d') startDate.setDate(now.getDate() - 90);
            else if (period === '1y') startDate.setFullYear(now.getFullYear() - 1);
            else if (period === 'all') startDate = PROJECT_START;

            // Ensure we don't go before project start if 'all' or if user wants strict cut-off
            // For 'all', we use project start. For others, we use the calculated date.

            const filtered = paidInvoices.filter((i: any) => {
                const d = new Date(i.createdAt);
                return d >= startDate;
            });

            // Group by Day
            const grouped = new Map<string, { amount: number; count: number }>();

            // Pre-fill dates to ensure continuous line (Bitcoin style needs continuity)
            // Iterate from startDate to now
            for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
                const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
                grouped.set(key, { amount: 0, count: 0 });
            }

            filtered.forEach((inv: any) => {
                const d = new Date(inv.createdAt);
                if (d < startDate) return; // Double check
                const key = d.toLocaleDateString('en-CA');
                if (grouped.has(key)) {
                    const current = grouped.get(key)!;
                    current.amount += (inv.amount || 0);
                    current.count += 1;
                }
            });

            const chartData = Array.from(grouped.entries()).map(([dateStr, val]) => ({
                date: new Date(dateStr),
                amount: val.amount,
                count: val.count
            })).sort((a, b) => a.date.getTime() - b.date.getTime());

            setData(chartData);
            setTotals({
                revenue: filtered.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0),
                transactions: filtered.length
            });

        } catch (e) {
            console.error("Chart Error", e);
        } finally {
            setLoading(false);
        }
    };

    const drawChart = () => {
        if (!svgRef.current || !containerRef.current || data.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 20, right: 0, bottom: 20, left: 0 };

        // Clear previous
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date) as [Date, Date])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.amount) || 0])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Gradient Definition
        const defs = svg.append("defs");
        const gradientId = "revenue-gradient";
        const gradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        const mainColor = theme.palette.success.main; // Bitcoin Green vibe

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", mainColor)
            .attr("stop-opacity", 0.5);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", mainColor)
            .attr("stop-opacity", 0);

        // Area Generator
        const area = d3.area<{ date: Date; amount: number }>()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.amount))
            .curve(d3.curveMonotoneX); // Smooth curve like crypto charts

        // Line Generator
        const line = d3.line<{ date: Date; amount: number }>()
            .x(d => x(d.date))
            .y(d => y(d.amount))
            .curve(d3.curveMonotoneX);

        // Draw Area
        svg.append("path")
            .datum(data)
            .attr("fill", `url(#${gradientId})`)
            .attr("d", area);

        // Draw Line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", mainColor)
            .attr("stroke-width", 2)
            .attr("d", line);

        // Interactive Overlay using Bisector
        const tooltip = d3.select(container).append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "8px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "10");

        const focusLine = svg.append("line")
            .style("stroke", theme.palette.text.secondary)
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0)
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom);

        const focusCircle = svg.append("circle")
            .style("fill", mainColor)
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .attr("r", 5)
            .style("opacity", 0);

        const bisect = d3.bisector((d: any) => d.date).left;

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focusLine.style("opacity", 1);
                focusCircle.style("opacity", 1);
                tooltip.style("visibility", "visible");
            })
            .on("mouseout", () => {
                focusLine.style("opacity", 0);
                focusCircle.style("opacity", 0);
                tooltip.style("visibility", "hidden");
                // Remove tooltip div needed? No, hidden is fine.
            })
            .on("mousemove", (event) => {
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = (d1 && d0) ? (x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0) : d0;

                if (!d) return;

                const cx = x(d.date);
                const cy = y(d.amount);

                focusLine
                    .attr("x1", cx)
                    .attr("x2", cx);

                focusCircle
                    .attr("cx", cx)
                    .attr("cy", cy);

                // Tooltip Positioning
                const tooltipX = cx + 15;
                const tooltipY = cy - 30;

                // Prevent tooltip overflow
                const tX = (cx > width - 100) ? cx - 120 : cx + 15;

                tooltip
                    .style("left", `${tX}px`)
                    .style("top", `${tooltipY}px`)
                    .html(`
                        <div style="font-weight:bold">${d.date.toLocaleDateString()}</div>
                        <div style="color:${theme.palette.success.light}">${formatCurrency(d.amount)}</div>
                        <div>${d.count} Transactions</div>
                    `);
            });
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <Card sx={{ p: 3, height: '100%', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                <div>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold">REVENUE PROGRESS</Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>
                        {formatCurrency(totals.revenue)}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                        {totals.transactions} Paid Transactions
                    </Typography>
                </div>

                <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                    <Button variant={period === '30d' ? 'contained' : 'outlined'} onClick={() => setPeriod('30d')}>30 Days</Button>
                    <Button variant={period === '90d' ? 'contained' : 'outlined'} onClick={() => setPeriod('90d')}>90 Days</Button>
                    <Button variant={period === '1y' ? 'contained' : 'outlined'} onClick={() => setPeriod('1y')}>1 Year</Button>
                    <Button variant={period === 'all' ? 'contained' : 'outlined'} onClick={() => setPeriod('all')}>All</Button>
                </ButtonGroup>
            </Box>

            {/* CHART CONTAINER */}
            <Box ref={containerRef} sx={{ height: 300, position: 'relative' }}>
                {loading && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.5)', zIndex: 10 }}>
                        <Typography>Loading Chart...</Typography>
                    </Box>
                )}
                {/* D3 SVG */}
                <svg ref={svgRef} width="100%" height="100%" style={{ overflow: 'visible' }} />
            </Box>
        </Card>
    );
}
