"use client";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Cpu, Search } from "lucide-react";
import { useTechportProject, useTechportProjects } from "@/hooks/useNasaApi";
import { DataState } from "../DataState";
import { Dialog } from "../Dialog";

function ProjectCard({ id, updated, onSelect }: { id: number; updated: string; onSelect: () => void }) {
  const query = useTechportProject(id);
  return <button className="es-card es-project-card" onClick={onSelect}><div><Cpu size={24} strokeWidth={1.2} /><span>NASA / {id}</span></div><h3>{query.data?.project?.title || (query.isPending ? "Discovering a new possibility…" : `Technology project ${id}`)}</h3><p>{query.data?.project?.description?.replace(/<[^>]*>/g, " ").slice(0, 150) || "Explore the project’s mission, development, and technology readiness."}</p><footer><span>Updated {updated}</span><ArrowUpRight size={16} /></footer></button>;
}
function ProjectDetail({ id }: { id: number }) {
  const query = useTechportProject(id);
  const project = query.data?.project;
  return <><DataState loading={query.isPending} error={query.error} retry={() => { void query.refetch(); }} />{project && <div className="es-detail-copy"><p className="es-kicker">NASA TECHPORT / {id}</p><h2>{project.title}</h2><div className="es-project-facts"><div><span>Status</span><strong>{project.statusDescription || "Not provided"}</strong></div><div><span>Development period</span><strong>{project.startDateString || "—"} → {project.endDateString || "—"}</strong></div><div><span>Technology readiness</span><strong>{project.currentTrl ?? "Not provided"}</strong></div></div><h3>About this project</h3><p>{project.description?.replace(/<[^>]*>/g, " ") || "No description is available for this project."}</p>{project.benefits && <><h3>Why it matters</h3><p>{project.benefits.replace(/<[^>]*>/g, " ")}</p></>}<a className="es-button es-button-secondary" href={`https://techport.nasa.gov/view/${id}`} target="_blank" rel="noopener noreferrer">View at NASA Techport<ArrowUpRight size={15} /></a></div>}</>;
}
export default function TechportPage() {
  const [since, setSince] = useState(() => { const date = new Date(); date.setUTCMonth(date.getUTCMonth() - 3); return date.toISOString().slice(0,10); });
  const [id, setId] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [limit, setLimit] = useState(6);
  const query = useTechportProjects({ updatedSince: since });
  const projects = [...(query.data?.projects || [])].sort((a,b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated));
  return <>
    <div className="es-controls"><label className="es-date-label">Updated since<input type="date" aria-label="Projects updated since" value={since} max={new Date().toISOString().slice(0,10)} onChange={event => { setSince(event.target.value); setLimit(6); }} /></label><form className="es-project-search" onSubmit={event => { event.preventDefault(); if (/^[1-9]\d*$/.test(id)) setSelected(Number(id)); }}><Search size={16} /><input type="number" min={1} aria-label="NASA project ID" value={id} onChange={event => setId(event.target.value)} placeholder="Find a project by ID" /><button className="es-button" disabled={!/^[1-9]\d*$/.test(id)}>Open<ArrowRight size={14} /></button></form></div>
    <div className="es-section-heading"><div><h2>Ideas taking shape</h2><p>{query.isPending ? "Preparing the technology portfolio…" : query.isError ? "Portfolio unavailable" : `${projects.length.toLocaleString()} projects updated in this period`}</p></div></div>
    <DataState loading={query.isPending} error={query.error} empty={!query.isPending && !query.isError && !projects.length} retry={() => { void query.refetch(); }} />
    {!query.isError && <div className="es-grid">{projects.slice(0,limit).map(project => <ProjectCard key={project.projectId} id={project.projectId} updated={project.lastUpdated} onSelect={() => setSelected(project.projectId)} />)}</div>}
    {!query.isError && projects.length > limit && <div className="es-pagination"><button className="es-button es-button-secondary" onClick={() => setLimit(value => value + 6)}>Discover more projects<ArrowRight size={14} /></button></div>}
    <Dialog open={selected !== null} onClose={() => setSelected(null)} title="NASA technology project" wide>{selected !== null && <ProjectDetail id={selected} />}</Dialog>
  </>;
}
