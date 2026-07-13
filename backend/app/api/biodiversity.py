from fastapi import APIRouter
import random

router = APIRouter()

SPECIES_DATABASE = [
    {
        "id": "sp-01",
        "name": "Bluefin Tuna",
        "scientific_name": "Thunnus thynnus",
        "conservation_status": "Endangered",
        "category": "Fishery Core",
        "detection_confidence": 98.4,
        "dna_match_score": 99.1,
        "depth_range": "0 - 1000m",
        "optimal_temp": "15C - 22C",
        "notes": "Highly migratory pelagic species. Vulnerable to illegal, unreported, and unregulated (IUU) fishing."
    },
    {
        "id": "sp-02",
        "name": "Great White Shark",
        "scientific_name": "Carcharodon carcharias",
        "conservation_status": "Vulnerable",
        "category": "Apex Predator",
        "detection_confidence": 92.1,
        "dna_match_score": 94.5,
        "depth_range": "0 - 1200m",
        "optimal_temp": "12C - 24C",
        "notes": "Keystone predator crucial for maintaining marine food web balance. eDNA traces found in zones C-4."
    },
    {
        "id": "sp-03",
        "name": "Staghorn Coral",
        "scientific_name": "Acropora cervicornis",
        "conservation_status": "Critically Endangered",
        "category": "Habitat Builder",
        "detection_confidence": 88.7,
        "dna_match_score": 91.2,
        "depth_range": "0 - 30m",
        "optimal_temp": "20C - 28C",
        "notes": "Fast-growing branching coral. Extremely sensitive to ocean acidification and marine heatwaves."
    },
    {
        "id": "sp-04",
        "name": "Giant Kelp",
        "scientific_name": "Macrocystis pyrifera",
        "conservation_status": "Least Concern",
        "category": "Primary Producer",
        "detection_confidence": 95.0,
        "dna_match_score": 97.8,
        "depth_range": "0 - 40m",
        "optimal_temp": "5C - 20C",
        "notes": "Forms dense underwater forests supporting hundreds of species. High thermal stress observed in lower latitudes."
    },
    {
        "id": "sp-05",
        "name": "Vaquita",
        "scientific_name": "Phocoena sinus",
        "conservation_status": "Critically Endangered",
        "category": "Cetacean",
        "detection_confidence": 76.5,
        "dna_match_score": 83.2,
        "depth_range": "0 - 50m",
        "optimal_temp": "18C - 26C",
        "notes": "World's rarest marine mammal. Active acoustic tracking suggests less than 10 individuals remaining in their native Gulf."
    }
]

TAXONOMIC_TREE = {
    "name": "Biota",
    "children": [
        {
            "name": "Animalia",
            "children": [
                {
                    "name": "Chordata",
                    "children": [
                        {
                            "name": "Actinopterygii",
                            "children": [
                                {"name": "Thunnus thynnus (Bluefin Tuna)", "status": "Endangered"},
                                {"name": "Gadus morhua (Atlantic Cod)", "status": "Vulnerable"}
                            ]
                        },
                        {
                            "name": "Chondrichthyes",
                            "children": [
                                {"name": "Carcharodon carcharias (White Shark)", "status": "Vulnerable"},
                                {"name": "Manta birostris (Giant Manta)", "status": "Endangered"}
                            ]
                        }
                    ]
                },
                {
                    "name": "Cnidaria",
                    "children": [
                        {
                            "name": "Anthozoa",
                            "children": [
                                {"name": "Acropora cervicornis (Staghorn Coral)", "status": "Critically Endangered"}
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

@router.get("/species")
def get_species_list():
    return SPECIES_DATABASE

@router.get("/taxonomic-tree")
def get_taxonomic_tree():
    return TAXONOMIC_TREE

@router.get("/edna-sample")
def get_edna_sample(location: str = "Zone 4"):
    # Generates a mock eDNA sequencing alignment visualization
    random.seed(hash(location))
    nucleotides = ["A", "T", "C", "G"]
    
    # Generate 5 sequence reads matching coral, tuna, shark, etc.
    mock_reads = []
    names = ["Bluefin Tuna", "Great White Shark", "Staghorn Coral", "Unknown Organism", "Marine Microbe"]
    for i in range(5):
        base_sequence = "".join(random.choices(nucleotides, k=40))
        # Insert a highlighted mutated/variant locus for HUD style visualization
        variant_index = random.randint(10, 30)
        sequence_list = list(base_sequence)
        sequence_list[variant_index] = f"<span class='text-cyan-400 font-bold glow'>{sequence_list[variant_index]}</span>"
        mutated_seq = "".join(sequence_list)
        
        mock_reads.append({
            "species": names[i],
            "sequence": base_sequence,
            "html_sequence": mutated_seq,
            "read_depth": random.randint(150, 2400),
            "alignment_score": round(85.0 + random.uniform(0, 15.0), 2)
        })
        
    return {
        "sample_id": f"EDNA-{random.randint(10000, 99999)}",
        "location": location,
        "species_richness": random.randint(12, 48),
        "reads": mock_reads
    }
