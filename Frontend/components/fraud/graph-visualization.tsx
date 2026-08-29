'use client';

import * as React from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GRAPH_NODE_CONFIG } from '@/lib/constants';
import type { GraphData, GraphNode, GraphRelationship } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GraphVisualizationProps {
  data: GraphData;
  onNodeSelect?: (node: GraphNode | null) => void;
  className?: string;
}

interface SimNode extends d3.SimulationNodeDatum, GraphNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: string;
}

export function GraphVisualization({
  data,
  onNodeSelect,
  className,
}: GraphVisualizationProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 600, height: 400 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(entry.contentRect.height, 350),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Simulation
    const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = data.relationships.map((r) => ({
      ...r,
      source: r.source,
      target: r.target,
    }));

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(80)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(35));

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Nodes
    const node = g
      .append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append('circle')
      .attr('r', (d) => GRAPH_NODE_CONFIG[d.type].radius)
      .attr('fill', (d) => GRAPH_NODE_CONFIG[d.type].color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    node
      .append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', (d) => GRAPH_NODE_CONFIG[d.type].radius + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-weight', '500');

    // Node selection
    node.on('click', (_event, d) => {
      setSelectedNode(d);
      onNodeSelect?.(d);
      // Highlight connected
      const connectedIds = new Set<string>();
      links.forEach((l) => {
        const s = l.source as SimNode;
        const t = l.target as SimNode;
        if (s.id === d.id) connectedIds.add(t.id);
        if (t.id === d.id) connectedIds.add(s.id);
      });
      connectedIds.add(d.id);

      node.select('circle').attr('opacity', (n) =>
        connectedIds.has(n.id) ? 1 : 0.2
      );
      link.attr('stroke-opacity', (l) => {
        const s = l.source as SimNode;
        const t = l.target as SimNode;
        return s.id === d.id || t.id === d.id ? 1 : 0.1;
      });
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x!)
        .attr('y1', (d) => (d.source as SimNode).y!)
        .attr('x2', (d) => (d.target as SimNode).x!)
        .attr('y2', (d) => (d.target as SimNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, onNodeSelect]);

  const resetGraph = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity
    );
    setSelectedNode(null);
    onNodeSelect?.(null);
    // Reset opacity
    d3.select(svgRef.current)
      .selectAll('circle')
      .attr('opacity', 0.9);
    d3.select(svgRef.current)
      .selectAll('line')
      .attr('stroke-opacity', 0.6);
  };

  const zoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy,
      1.3
    );
  };

  const zoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy,
      0.7
    );
  };

  return (
    <div ref={containerRef} className={cn('relative h-[400px] w-full lg:h-[500px]', className)}>
      <svg ref={svgRef} className="h-full w-full" />
      {/* Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={resetGraph}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {Object.entries(GRAPH_NODE_CONFIG).map(([type, config]) => (
        <div key={type} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs text-muted-foreground">{config.label}</span>
        </div>
      ))}
    </div>
  );
}
