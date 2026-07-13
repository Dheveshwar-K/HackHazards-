import React, { useState, useEffect } from "react";

interface SpeciesCard {
  id: string;
  name: string;
  scientific_name: string;
  conservation_status: string;
  category: string;
  detection_confidence: number;
  dna_match_score: number;
  depth_range: string;
  optimal_temp: string;
  notes: string;
}

export const Biodiversity: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesCard[]>([]);
  const [ednaData, setEdnaData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState("Reef Sector B-14");

  useEffect(() => {
    // Load species data
    const fetchSpecies = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/biodiversity/species");
        if (res.ok) {
          const data = await res.json();
          setSpecies(data);
        } else {
          throw new Error("Offline");
        }
      } catch (err) {
        // Fallback species catalog
        setSpecies([
          {
            id: "sp-01",
            name: "Bluefin Tuna",
            scientific_name: "Thunnus thynnus",
            conservation_status: "Endangered",
            category: "Fishery Core",
            detection_confidence: 98.4,
            dna_match_score: 99.1,
            depth_range: "0 - 1000m",
            optimal_temp: "15C - 22C",
            notes: "Highly migratory pelagic species. Vulnerable to illegal, unreported, and unregulated (IUU) fishing."
          },
          {
            id: "sp-02",
            name: "Great White Shark",
            scientific_name: "Carcharodon carcharias",
            conservation_status: "Vulnerable",
            category: "Apex Predator",
            detection_confidence: 92.1,
            dna_match_score: 94.5,
            depth_range: "0 - 1200m",
            optimal_temp: "12C - 24C",
            notes: "Keystone predator crucial for maintaining marine food web balance. eDNA traces found in zones C-4."
          },
          {
            id: "sp-03",
            name: "Staghorn Coral",
            scientific_name: "Acropora cervicornis",
            conservation_status: "Critically Endangered",
            category: "Habitat Builder",
            detection_confidence: 88.7,
            dna_match_score: 91.2,
            depth_range: "0 - 30m",
            optimal_temp: "20C - 28C",
            notes: "Fast-growing branching coral. Extremely sensitive to ocean acidification and marine heatwaves."
          },
          {
            id: "sp-04",
            name: "Giant Kelp",
            scientific_name: "Macrocystis pyrifera",
            conservation_status: "Least Concern",
            category: "Primary Producer",
            detection_confidence: 95.0,
            dna_match_score: 97.8,
            depth_range: "0 - 40m",
            optimal_temp: "5C - 20C",
            notes: "Forms dense forests supporting marine life. Temperature anomalies cause severe local canopy loss."
          }
        ]);
      }
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    // Generate eDNA reports based on location
    const fetchEdna = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/biodiversity/edna-sample?location=${encodeURIComponent(selectedLocation)}`);
        if (res.ok) {
          const data = await res.json();
          setEdnaData(data);
        } else {
          throw new Error("Offline");
        }
      } catch (err) {
        // Fallback eDNA reads
        setEdnaData({
          sample_id: "EDNA-84729",
          location: selectedLocation,
          species_richness: 24,
          reads: [
            {
              species: "Bluefin Tuna",
              sequence: "AGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT",
              html_sequence: "AGCTAGCTAGCTAGCT<span class='text-cyan-400 font-bold glow'>A</span>CTAGCTAGCTAGCTAGCTAGCT",
              alignment_score: 99.1,
              read_depth: 1820
            },
            {
              species: "Great White Shark",
              sequence: "CGTTCGTTCGTTCGTTCGTTCGTTCGTTCGTTCGTTCGTT",
              html_sequence: "CGTTCGTTCGTT<span class='text-cyan-400 font-bold glow'>T</span>TCGTTCGTTCGTTCGTTCGTTCGTT",
              alignment_score: 94.5,
              read_depth: 620
            },
            {
              species: "Staghorn Coral",
              sequence: "AATCAATCAATCAATCAATCAATCAATCAATCAATCAATC",
              html_sequence: "AATCAATC<span class='text-accent font-bold glow'>C</span>ATCAATCAATCAATCAATCAATCAATC",
              alignment_score: 91.2,
              read_depth: 340
            }
          ]
        });
      }
    };
    fetchEdna();
  }, [selectedLocation]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="border-b border-cyan-400/20 pb-4">
        <span className="text-[10px] text-cyan-400 font-numeric font-bold tracking-widest block uppercase">
          Autonomous Taxonomic Registry
        </span>
        <h2 className="text-xl font-bold font-orbitron tracking-wider text-slate-100 uppercase">
          Marine Biodiversity Module
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Species cards (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel border border-cyan-400/20 px-4 py-3 rounded-xl flex justify-between items-center">
            <h3 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-widest">
              Monitored Species Registry
            </h3>
            <span className="text-[10px] font-numeric text-slate-400">COUNT: {species.length} Species</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {species.map((sp) => (
              <div
                key={sp.id}
                className="glass-panel border border-cyan-400/15 p-4 rounded-xl flex flex-col gap-3 transition-all duration-300 hover:border-cyan-400/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{sp.name}</h4>
                    <span className="text-[10px] italic text-slate-400 block">{sp.scientific_name}</span>
                  </div>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      sp.conservation_status.includes("Critically")
                        ? "bg-danger/15 text-danger border-danger/30 text-glow-red"
                        : sp.conservation_status.includes("Endangered") || sp.conservation_status.includes("Vulnerable")
                        ? "bg-warning/15 text-warning border-warning/30 text-glow-orange"
                        : "bg-accent/15 text-accent border-accent/30 text-glow-green"
                    }`}
                  >
                    {sp.conservation_status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-numeric border-t border-b border-cyan-400/10 py-2">
                  <div>
                    <span className="text-slate-500 block">DEPTH</span>
                    <span className="text-cyan-400 font-bold">{sp.depth_range}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">OPTIMAL SST</span>
                    <span className="text-cyan-400 font-bold">{sp.optimal_temp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">DET_CONF</span>
                    <span className="text-accent font-bold">{sp.detection_confidence}%</span>
                  </div>
                </div>

                <p className="text-xs font-sub text-slate-400 leading-normal">
                  {sp.notes}
                </p>

                <div className="mt-auto pt-2 flex justify-between items-center text-[9px] font-numeric text-slate-500">
                  <span>CATEGORY: {sp.category}</span>
                  <span>DNA MATCH: {sp.dna_match_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: eDNA sequencing diagnostics */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel border border-cyan-400/20 p-5 rounded-2xl flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-numeric text-cyan-400/60 uppercase block">Spatial eDNA Sequencer</span>
              <h3 className="text-sm font-bold font-orbitron text-slate-100 uppercase tracking-wide">
                Environmental DNA
              </h3>
            </div>

            {/* Location dropdown simulator */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 uppercase font-sub">Sample Site</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-black/60 border border-cyan-400/25 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sub"
              >
                <option value="Reef Sector B-14">Coral Triangle Shelf B-14</option>
                <option value="California Sector K">California Upwelling Shelf K</option>
                <option value="North Atlantic B">North Atlantic Drift Grid B</option>
              </select>
            </div>

            {/* DNA report output */}
            {ednaData && (
              <div className="flex flex-col gap-4 font-numeric text-xs border-t border-cyan-400/10 pt-3 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[9px]">SAMPLE ID:</span>
                  <span className="text-cyan-400 font-bold text-glow-cyan">{ednaData.sample_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[9px]">SPECIES RICHNESS:</span>
                  <span className="text-accent font-bold text-glow-green">{ednaData.species_richness} OTUs</span>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-sub">Gene Alignment Reads</span>
                  {ednaData.reads.map((read: any, idx: number) => (
                    <div key={idx} className="bg-black/55 border border-cyan-400/10 p-2.5 rounded flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-300 font-bold font-sub">{read.species}</span>
                        <span className="text-accent">{read.alignment_score}% match</span>
                      </div>
                      <div 
                        className="font-numeric text-[8px] tracking-wider break-all text-slate-500 select-all"
                        dangerouslySetInnerHTML={{ __html: read.html_sequence }}
                      />
                      <div className="flex justify-between text-[8px] text-slate-500 border-t border-cyan-400/5 pt-1">
                        <span>READS DEPTH: {read.read_depth}x</span>
                        <span>LOCUS: COX1-COI</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
