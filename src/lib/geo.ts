export interface District {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  districts?: District[];
}

export interface Region {
  id: string;
  name: string;
  cities: City[];
}

// Complete 23 Regional Partners (RP) Structure for Portugal Network
export interface NetworkHubDef {
  id: string;
  code: string;
  name: string;
  city: string;
  territories: string[];
  tpsCount: number;
}

export interface NetworkRPDef {
  id: string;
  code: string;
  name: string;
  director: string;
  region: string;
  status: 'Active' | 'Pending' | 'Planning';
  hubs: NetworkHubDef[];
}

export const NETWORK_23_REGIONS: NetworkRPDef[] = [
  {
    id: "rp_algarve",
    code: "Pt-RD-001",
    name: "RP Algarve",
    director: "Director Algarve",
    region: "Algarve",
    status: "Active",
    hubs: [
      { id: "hub_alg_01", code: "HUB-ALG-001", name: "Lagos Hub", city: "Lagos", territories: ["Lagos"], tpsCount: 4 },
      { id: "hub_alg_02", code: "HUB-ALG-002", name: "Portimão Hub", city: "Portimão", territories: ["Portimão"], tpsCount: 4 },
      { id: "hub_alg_03", code: "HUB-ALG-003", name: "Lagoa–Silves Hub", city: "Lagoa", territories: ["Lagoa", "Silves"], tpsCount: 4 },
      { id: "hub_alg_04", code: "HUB-ALG-004", name: "Albufeira Hub", city: "Albufeira", territories: ["Albufeira"], tpsCount: 4 },
      { id: "hub_alg_05", code: "HUB-ALG-005", name: "Loulé–Quarteira–Vilamoura Hub", city: "Loulé", territories: ["Loulé", "Quarteira", "Vilamoura"], tpsCount: 4 },
      { id: "hub_alg_06", code: "HUB-ALG-006", name: "Faro Hub", city: "Faro", territories: ["Faro"], tpsCount: 4 },
      { id: "hub_alg_07", code: "HUB-ALG-007", name: "Olhão Hub", city: "Olhão", territories: ["Olhão"], tpsCount: 4 },
      { id: "hub_alg_08", code: "HUB-ALG-008", name: "Tavira Hub", city: "Tavira", territories: ["Tavira"], tpsCount: 4 },
      { id: "hub_alg_09", code: "HUB-ALG-009", name: "Eastern Algarve Hub", city: "Vila Real de Santo António", territories: ["Vila Real de Santo António", "Castro Marim", "Alcoutim"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_alentejo",
    code: "Pt-RD-002",
    name: "RP Alentejo",
    director: "Director Alentejo",
    region: "Alentejo",
    status: "Active",
    hubs: [
      { id: "hub_ale_01", code: "HUB-ALE-001", name: "Évora Hub", city: "Évora", territories: ["Évora"], tpsCount: 4 },
      { id: "hub_ale_02", code: "HUB-ALE-002", name: "Montemor-o-Novo Hub", city: "Montemor-o-Novo", territories: ["Montemor-o-Novo"], tpsCount: 4 },
      { id: "hub_ale_03", code: "HUB-ALE-003", name: "Portalegre Hub", city: "Portalegre", territories: ["Portalegre"], tpsCount: 4 },
      { id: "hub_ale_04", code: "HUB-ALE-004", name: "Elvas Hub", city: "Elvas", territories: ["Elvas"], tpsCount: 4 },
      { id: "hub_ale_05", code: "HUB-ALE-005", name: "Sines–Santiago do Cacém Hub", city: "Sines", territories: ["Sines", "Santiago do Cacém"], tpsCount: 4 },
      { id: "hub_ale_06", code: "HUB-ALE-006", name: "Beja Hub", city: "Beja", territories: ["Beja"], tpsCount: 4 },
      { id: "hub_ale_07", code: "HUB-ALE-007", name: "Moura Hub", city: "Moura", territories: ["Moura"], tpsCount: 4 },
      { id: "hub_ale_08", code: "HUB-ALE-008", name: "Odemira Hub", city: "Odemira", territories: ["Odemira"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_azores",
    code: "Pt-RD-003",
    name: "RP Azores",
    director: "Director Azores",
    region: "Azores",
    status: "Active",
    hubs: [
      { id: "hub_azo_01", code: "HUB-AZO-001", name: "São Miguel Hub", city: "Ponta Delgada", territories: ["São Miguel"], tpsCount: 4 },
      { id: "hub_azo_02", code: "HUB-AZO-002", name: "Terceira Hub", city: "Angra do Heroísmo", territories: ["Terceira"], tpsCount: 4 },
      { id: "hub_azo_03", code: "HUB-AZO-003", name: "Faial–Pico Hub", city: "Horta", territories: ["Faial", "Pico"], tpsCount: 4 },
      { id: "hub_azo_04", code: "HUB-AZO-004", name: "São Jorge Hub", city: "Velas", territories: ["São Jorge"], tpsCount: 4 },
      { id: "hub_azo_05", code: "HUB-AZO-005", name: "Santa Maria Hub", city: "Vila do Porto", territories: ["Santa Maria"], tpsCount: 4 },
      { id: "hub_azo_06", code: "HUB-AZO-006", name: "Graciosa Hub", city: "Santa Cruz da Graciosa", territories: ["Graciosa"], tpsCount: 4 },
      { id: "hub_azo_07", code: "HUB-AZO-007", name: "Flores–Corvo Hub", city: "Santa Cruz das Flores", territories: ["Flores", "Corvo"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_aveiro",
    code: "Pt-RD-004",
    name: "RP Aveiro",
    director: "Director Aveiro",
    region: "Aveiro",
    status: "Active",
    hubs: [
      { id: "hub_ave_01", code: "HUB-AVE-001", name: "Aveiro Hub", city: "Aveiro", territories: ["Aveiro"], tpsCount: 4 },
      { id: "hub_ave_02", code: "HUB-AVE-002", name: "Ílhavo–Vagos Hub", city: "Ílhavo", territories: ["Ílhavo", "Vagos"], tpsCount: 4 },
      { id: "hub_ave_03", code: "HUB-AVE-003", name: "Águeda Hub", city: "Águeda", territories: ["Águeda"], tpsCount: 4 },
      { id: "hub_ave_04", code: "HUB-AVE-004", name: "Ovar–Estarreja Hub", city: "Ovar", territories: ["Ovar", "Estarreja"], tpsCount: 4 },
      { id: "hub_ave_05", code: "HUB-AVE-005", name: "Oliveira de Azeméis Hub", city: "Oliveira de Azeméis", territories: ["Oliveira de Azeméis"], tpsCount: 4 },
      { id: "hub_ave_06", code: "HUB-AVE-006", name: "São João da Madeira Hub", city: "São João da Madeira", territories: ["São João da Madeira"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_braga",
    code: "Pt-RD-005",
    name: "RP Braga",
    director: "Director Braga",
    region: "Braga",
    status: "Active",
    hubs: [
      { id: "hub_bra_01", code: "HUB-BRA-001", name: "Braga Hub", city: "Braga", territories: ["Braga"], tpsCount: 4 },
      { id: "hub_bra_02", code: "HUB-BRA-002", name: "Guimarães Hub", city: "Guimarães", territories: ["Guimarães"], tpsCount: 4 },
      { id: "hub_bra_03", code: "HUB-BRA-003", name: "Barcelos Hub", city: "Barcelos", territories: ["Barcelos"], tpsCount: 4 },
      { id: "hub_bra_04", code: "HUB-BRA-004", name: "Vila Verde–Amares Hub", city: "Vila Verde", territories: ["Vila Verde", "Amares"], tpsCount: 4 },
      { id: "hub_bra_05", code: "HUB-BRA-005", name: "Esposende Hub", city: "Esposende", territories: ["Esposende"], tpsCount: 4 },
      { id: "hub_bra_06", code: "HUB-BRA-006", name: "Fafe Hub", city: "Fafe", territories: ["Fafe"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_central_interior",
    code: "Pt-RD-006",
    name: "RP Central Interior",
    director: "Director Central Interior",
    region: "Central Interior",
    status: "Active",
    hubs: [
      { id: "hub_cen_01", code: "HUB-CEN-001", name: "Viseu Hub", city: "Viseu", territories: ["Viseu"], tpsCount: 4 },
      { id: "hub_cen_02", code: "HUB-CEN-002", name: "Guarda Hub", city: "Guarda", territories: ["Guarda"], tpsCount: 4 },
      { id: "hub_cen_03", code: "HUB-CEN-003", name: "Covilhã–Fundão Hub", city: "Covilhã", territories: ["Covilhã", "Fundão"], tpsCount: 4 },
      { id: "hub_cen_04", code: "HUB-CEN-004", name: "Castelo Branco Hub", city: "Castelo Branco", territories: ["Castelo Branco"], tpsCount: 4 },
      { id: "hub_cen_05", code: "HUB-CEN-005", name: "Seia–Gouveia Hub", city: "Seia", territories: ["Seia", "Gouveia"], tpsCount: 4 },
      { id: "hub_cen_06", code: "HUB-CEN-006", name: "Tondela Hub", city: "Tondela", territories: ["Tondela"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_coimbra",
    code: "Pt-RD-007",
    name: "RP Coimbra",
    director: "Director Coimbra",
    region: "Coimbra",
    status: "Active",
    hubs: [
      { id: "hub_coi_01", code: "HUB-COI-001", name: "Coimbra Hub", city: "Coimbra", territories: ["Coimbra"], tpsCount: 4 },
      { id: "hub_coi_02", code: "HUB-COI-002", name: "Figueira da Foz Hub", city: "Figueira da Foz", territories: ["Figueira da Foz"], tpsCount: 4 },
      { id: "hub_coi_03", code: "HUB-COI-003", name: "Cantanhede Hub", city: "Cantanhede", territories: ["Cantanhede"], tpsCount: 4 },
      { id: "hub_coi_04", code: "HUB-COI-004", name: "Condeixa-a-Nova Hub", city: "Condeixa-a-Nova", territories: ["Condeixa-a-Nova"], tpsCount: 4 },
      { id: "hub_coi_05", code: "HUB-COI-005", name: "Lousã–Miranda do Corvo Hub", city: "Lousã", territories: ["Lousã", "Miranda do Corvo"], tpsCount: 4 },
      { id: "hub_coi_06", code: "HUB-COI-006", name: "Mealhada Hub", city: "Mealhada", territories: ["Mealhada"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_lisbon",
    code: "Pt-RD-008",
    name: "RP Lisbon",
    director: "Director Lisbon",
    region: "Lisbon",
    status: "Active",
    hubs: [
      { id: "hub_lis_01", code: "HUB-LIS-001", name: "Lisbon Hub", city: "Lisbon", territories: ["Lisbon"], tpsCount: 4 },
      { id: "hub_lis_02", code: "HUB-LIS-002", name: "Sintra Hub", city: "Sintra", territories: ["Sintra"], tpsCount: 4 },
      { id: "hub_lis_03", code: "HUB-LIS-003", name: "Cascais Hub", city: "Cascais", territories: ["Cascais"], tpsCount: 4 },
      { id: "hub_lis_04", code: "HUB-LIS-004", name: "Oeiras Hub", city: "Oeiras", territories: ["Oeiras"], tpsCount: 4 },
      { id: "hub_lis_05", code: "HUB-LIS-005", name: "Amadora Hub", city: "Amadora", territories: ["Amadora"], tpsCount: 4 },
      { id: "hub_lis_06", code: "HUB-LIS-006", name: "Odivelas Hub", city: "Odivelas", territories: ["Odivelas"], tpsCount: 4 },
      { id: "hub_lis_07", code: "HUB-LIS-007", name: "Loures Hub", city: "Loures", territories: ["Loures"], tpsCount: 4 },
      { id: "hub_lis_08", code: "HUB-LIS-008", name: "Vila Franca de Xira Hub", city: "Vila Franca de Xira", territories: ["Vila Franca de Xira"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_leiria",
    code: "Pt-RD-009",
    name: "RP Leiria",
    director: "Director Leiria",
    region: "Leiria",
    status: "Active",
    hubs: [
      { id: "hub_lei_01", code: "HUB-LEI-001", name: "Leiria Hub", city: "Leiria", territories: ["Leiria"], tpsCount: 4 },
      { id: "hub_lei_02", code: "HUB-LEI-002", name: "Marinha Grande Hub", city: "Marinha Grande", territories: ["Marinha Grande"], tpsCount: 4 },
      { id: "hub_lei_03", code: "HUB-LEI-003", name: "Pombal Hub", city: "Pombal", territories: ["Pombal"], tpsCount: 4 },
      { id: "hub_lei_04", code: "HUB-LEI-004", name: "Alcobaça Hub", city: "Alcobaça", territories: ["Alcobaça"], tpsCount: 4 },
      { id: "hub_lei_05", code: "HUB-LEI-005", name: "Nazaré Hub", city: "Nazaré", territories: ["Nazaré"], tpsCount: 4 },
      { id: "hub_lei_06", code: "HUB-LEI-006", name: "Porto de Mós Hub", city: "Porto de Mós", territories: ["Porto de Mós"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_madeira",
    code: "Pt-RD-010",
    name: "RP Madeira",
    director: "Director Madeira",
    region: "Madeira",
    status: "Active",
    hubs: [
      { id: "hub_mad_01", code: "HUB-MAD-001", name: "Funchal Hub", city: "Funchal", territories: ["Funchal"], tpsCount: 4 },
      { id: "hub_mad_02", code: "HUB-MAD-002", name: "Santa Cruz Hub", city: "Santa Cruz", territories: ["Santa Cruz"], tpsCount: 4 },
      { id: "hub_mad_03", code: "HUB-MAD-003", name: "Câmara de Lobos Hub", city: "Câmara de Lobos", territories: ["Câmara de Lobos"], tpsCount: 4 },
      { id: "hub_mad_04", code: "HUB-MAD-004", name: "Machico Hub", city: "Machico", territories: ["Machico"], tpsCount: 4 },
      { id: "hub_mad_05", code: "HUB-MAD-005", name: "Ribeira Brava Hub", city: "Ribeira Brava", territories: ["Ribeira Brava"], tpsCount: 4 },
      { id: "hub_mad_06", code: "HUB-MAD-006", name: "Calheta Hub", city: "Calheta", territories: ["Calheta"], tpsCount: 4 },
      { id: "hub_mad_07", code: "HUB-MAD-007", name: "Santana–São Vicente Hub", city: "Santana", territories: ["Santana", "São Vicente"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_minho",
    code: "Pt-RD-011",
    name: "RP Minho",
    director: "Director Minho",
    region: "Minho",
    status: "Active",
    hubs: [
      { id: "hub_min_01", code: "HUB-MIN-001", name: "Viana do Castelo Hub", city: "Viana do Castelo", territories: ["Viana do Castelo"], tpsCount: 4 },
      { id: "hub_min_02", code: "HUB-MIN-002", name: "Ponte de Lima Hub", city: "Ponte de Lima", territories: ["Ponte de Lima"], tpsCount: 4 },
      { id: "hub_min_03", code: "HUB-MIN-003", name: "Valença–Vila Nova de Cerveira Hub", city: "Valença", territories: ["Valença", "Vila Nova de Cerveira"], tpsCount: 4 },
      { id: "hub_min_04", code: "HUB-MIN-004", name: "Monção–Melgaço Hub", city: "Monção", territories: ["Monção", "Melgaço"], tpsCount: 4 },
      { id: "hub_min_05", code: "HUB-MIN-005", name: "Arcos de Valdevez Hub", city: "Arcos de Valdevez", territories: ["Arcos de Valdevez"], tpsCount: 4 },
      { id: "hub_min_06", code: "HUB-MIN-006", name: "Caminha Hub", city: "Caminha", territories: ["Caminha"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_north_porto",
    code: "Pt-RD-012",
    name: "RP North Porto",
    director: "Director North Porto",
    region: "North Porto",
    status: "Active",
    hubs: [
      { id: "hub_npo_01", code: "HUB-NPO-001", name: "Porto Hub", city: "Porto", territories: ["Porto"], tpsCount: 4 },
      { id: "hub_npo_02", code: "HUB-NPO-002", name: "Matosinhos Hub", city: "Matosinhos", territories: ["Matosinhos"], tpsCount: 4 },
      { id: "hub_npo_03", code: "HUB-NPO-003", name: "Maia Hub", city: "Maia", territories: ["Maia"], tpsCount: 4 },
      { id: "hub_npo_04", code: "HUB-NPO-004", name: "Vila do Conde Hub", city: "Vila do Conde", territories: ["Vila do Conde"], tpsCount: 4 },
      { id: "hub_npo_05", code: "HUB-NPO-005", name: "Póvoa de Varzim Hub", city: "Póvoa de Varzim", territories: ["Póvoa de Varzim"], tpsCount: 4 },
      { id: "hub_npo_06", code: "HUB-NPO-006", name: "Valongo Hub", city: "Valongo", territories: ["Valongo"], tpsCount: 4 },
      { id: "hub_npo_07", code: "HUB-NPO-007", name: "Gondomar Hub", city: "Gondomar", territories: ["Gondomar"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_south_porto",
    code: "Pt-RD-013",
    name: "RP South Porto",
    director: "Director South Porto",
    region: "South Porto",
    status: "Active",
    hubs: [
      { id: "hub_spo_01", code: "HUB-SPO-001", name: "Vila Nova de Gaia Hub", city: "Vila Nova de Gaia", territories: ["Vila Nova de Gaia"], tpsCount: 4 },
      { id: "hub_spo_02", code: "HUB-SPO-002", name: "Espinho Hub", city: "Espinho", territories: ["Espinho"], tpsCount: 4 },
      { id: "hub_spo_03", code: "HUB-SPO-003", name: "Santa Maria da Feira Hub", city: "Santa Maria da Feira", territories: ["Santa Maria da Feira"], tpsCount: 4 },
      { id: "hub_spo_04", code: "HUB-SPO-004", name: "Oliveira de Azeméis Hub", city: "Oliveira de Azeméis", territories: ["Oliveira de Azeméis"], tpsCount: 4 },
      { id: "hub_spo_05", code: "HUB-SPO-005", name: "Vale de Cambra Hub", city: "Vale de Cambra", territories: ["Vale de Cambra"], tpsCount: 4 },
      { id: "hub_spo_06", code: "HUB-SPO-006", name: "Arouca Hub", city: "Arouca", territories: ["Arouca"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_tamega_sousa",
    code: "Pt-RD-014",
    name: "RP Tâmega e Sousa",
    director: "Director Tâmega e Sousa",
    region: "Tâmega e Sousa",
    status: "Active",
    hubs: [
      { id: "hub_tam_01", code: "HUB-TAM-001", name: "Penafiel Hub", city: "Penafiel", territories: ["Penafiel"], tpsCount: 4 },
      { id: "hub_tam_02", code: "HUB-TAM-002", name: "Paredes Hub", city: "Paredes", territories: ["Paredes"], tpsCount: 4 },
      { id: "hub_tam_03", code: "HUB-TAM-003", name: "Paços de Ferreira Hub", city: "Paços de Ferreira", territories: ["Paços de Ferreira"], tpsCount: 4 },
      { id: "hub_tam_04", code: "HUB-TAM-004", name: "Felgueiras Hub", city: "Felgueiras", territories: ["Felgueiras"], tpsCount: 4 },
      { id: "hub_tam_05", code: "HUB-TAM-005", name: "Lousada Hub", city: "Lousada", territories: ["Lousada"], tpsCount: 4 },
      { id: "hub_tam_06", code: "HUB-TAM-006", name: "Amarante Hub", city: "Amarante", territories: ["Amarante"], tpsCount: 4 },
      { id: "hub_tam_07", code: "HUB-TAM-007", name: "Marco de Canaveses Hub", city: "Marco de Canaveses", territories: ["Marco de Canaveses"], tpsCount: 4 },
      { id: "hub_tam_08", code: "HUB-TAM-008", name: "Baião Hub", city: "Baião", territories: ["Baião"], tpsCount: 4 },
      { id: "hub_tam_09", code: "HUB-TAM-009", name: "Resende Hub", city: "Resende", territories: ["Resende"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_tras_os_montes",
    code: "Pt-RD-015",
    name: "RP Trás-os-Montes",
    director: "Director Trás-os-Montes",
    region: "Trás-os-Montes",
    status: "Active",
    hubs: [
      { id: "hub_tra_01", code: "HUB-TRA-001", name: "Vila Real Hub", city: "Vila Real", territories: ["Vila Real"], tpsCount: 4 },
      { id: "hub_tra_02", code: "HUB-TRA-002", name: "Chaves Hub", city: "Chaves", territories: ["Chaves"], tpsCount: 4 },
      { id: "hub_tra_03", code: "HUB-TRA-003", name: "Bragança Hub", city: "Bragança", territories: ["Bragança"], tpsCount: 4 },
      { id: "hub_tra_04", code: "HUB-TRA-004", name: "Mirandela Hub", city: "Mirandela", territories: ["Mirandela"], tpsCount: 4 },
      { id: "hub_tra_05", code: "HUB-TRA-005", name: "Macedo de Cavaleiros Hub", city: "Macedo de Cavaleiros", territories: ["Macedo de Cavaleiros"], tpsCount: 4 },
      { id: "hub_tra_06", code: "HUB-TRA-006", name: "Peso da Régua Hub", city: "Peso da Régua", territories: ["Peso da Régua"], tpsCount: 4 },
      { id: "hub_tra_07", code: "HUB-TRA-007", name: "Alijó Hub", city: "Alijó", territories: ["Alijó"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_oeste",
    code: "Pt-RD-016",
    name: "RP Oeste",
    director: "Director Oeste",
    region: "Oeste",
    status: "Active",
    hubs: [
      { id: "hub_oes_01", code: "HUB-OES-001", name: "Torres Vedras Hub", city: "Torres Vedras", territories: ["Torres Vedras"], tpsCount: 4 },
      { id: "hub_oes_02", code: "HUB-OES-002", name: "Caldas da Rainha Hub", city: "Caldas da Rainha", territories: ["Caldas da Rainha"], tpsCount: 4 },
      { id: "hub_oes_03", code: "HUB-OES-003", name: "Peniche Hub", city: "Peniche", territories: ["Peniche"], tpsCount: 4 },
      { id: "hub_oes_04", code: "HUB-OES-004", name: "Alcobaça Hub", city: "Alcobaça", territories: ["Alcobaça"], tpsCount: 4 },
      { id: "hub_oes_05", code: "HUB-OES-005", name: "Óbidos Hub", city: "Óbidos", territories: ["Óbidos"], tpsCount: 4 },
      { id: "hub_oes_06", code: "HUB-OES-006", name: "Bombarral Hub", city: "Bombarral", territories: ["Bombarral"], tpsCount: 4 },
      { id: "hub_oes_07", code: "HUB-OES-007", name: "Lourinhã Hub", city: "Lourinhã", territories: ["Lourinhã"], tpsCount: 4 },
      { id: "hub_oes_08", code: "HUB-OES-008", name: "Cadaval Hub", city: "Cadaval", territories: ["Cadaval"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_setubal",
    code: "Pt-RD-017",
    name: "RP Setúbal",
    director: "Director Setúbal",
    region: "Setúbal",
    status: "Active",
    hubs: [
      { id: "hub_set_01", code: "HUB-SET-001", name: "Almada Hub", city: "Almada", territories: ["Almada"], tpsCount: 4 },
      { id: "hub_set_02", code: "HUB-SET-002", name: "Seixal Hub", city: "Seixal", territories: ["Seixal"], tpsCount: 4 },
      { id: "hub_set_03", code: "HUB-SET-003", name: "Barreiro Hub", city: "Barreiro", territories: ["Barreiro"], tpsCount: 4 },
      { id: "hub_set_04", code: "HUB-SET-004", name: "Moita Hub", city: "Moita", territories: ["Moita"], tpsCount: 4 },
      { id: "hub_set_05", code: "HUB-SET-005", name: "Setúbal Hub", city: "Setúbal", territories: ["Setúbal"], tpsCount: 4 },
      { id: "hub_set_06", code: "HUB-SET-006", name: "Palmela Hub", city: "Palmela", territories: ["Palmela"], tpsCount: 4 },
      { id: "hub_set_07", code: "HUB-SET-007", name: "Sesimbra Hub", city: "Sesimbra", territories: ["Sesimbra"], tpsCount: 4 },
      { id: "hub_set_08", code: "HUB-SET-008", name: "Montijo Hub", city: "Montijo", territories: ["Montijo"], tpsCount: 4 },
      { id: "hub_set_09", code: "HUB-SET-009", name: "Alcochete Hub", city: "Alcochete", territories: ["Alcochete"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_santarem",
    code: "Pt-RD-018",
    name: "RP Santarém",
    director: "Director Santarém",
    region: "Santarém",
    status: "Active",
    hubs: [
      { id: "hub_san_01", code: "HUB-SAN-001", name: "Santarém Hub", city: "Santarém", territories: ["Santarém"], tpsCount: 4 },
      { id: "hub_san_02", code: "HUB-SAN-002", name: "Ourém Hub", city: "Ourém", territories: ["Ourém"], tpsCount: 4 },
      { id: "hub_san_03", code: "HUB-SAN-003", name: "Tomar Hub", city: "Tomar", territories: ["Tomar"], tpsCount: 4 },
      { id: "hub_san_04", code: "HUB-SAN-004", name: "Abrantes Hub", city: "Abrantes", territories: ["Abrantes"], tpsCount: 4 },
      { id: "hub_san_05", code: "HUB-SAN-005", name: "Entroncamento Hub", city: "Entroncamento", territories: ["Entroncamento"], tpsCount: 4 },
      { id: "hub_san_06", code: "HUB-SAN-006", name: "Torres Novas Hub", city: "Torres Novas", territories: ["Torres Novas"], tpsCount: 4 },
      { id: "hub_san_07", code: "HUB-SAN-007", name: "Almeirim Hub", city: "Almeirim", territories: ["Almeirim"], tpsCount: 4 },
      { id: "hub_san_08", code: "HUB-SAN-008", name: "Cartaxo Hub", city: "Cartaxo", territories: ["Cartaxo"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_big_lisboa",
    code: "Pt-RD-019",
    name: "RP Big Lisboa",
    director: "Director Big Lisboa",
    region: "Big Lisboa",
    status: "Active",
    hubs: [
      { id: "hub_blis_01", code: "HUB-BLIS-001", name: "Cascais & Sintra Hub", city: "Cascais", territories: ["Cascais", "Sintra"], tpsCount: 4 },
      { id: "hub_blis_02", code: "HUB-BLIS-002", name: "Oeiras & Amadora Hub", city: "Oeiras", territories: ["Oeiras", "Amadora"], tpsCount: 4 },
      { id: "hub_blis_03", code: "HUB-BLIS-003", name: "Loures & Odivelas Hub", city: "Loures", territories: ["Loures", "Odivelas"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_lisboa_city",
    code: "Pt-RD-020",
    name: "RP Lisboa City",
    director: "Director Lisboa City",
    region: "Lisboa City",
    status: "Active",
    hubs: [
      { id: "hub_lisc_01", code: "HUB-LISC-001", name: "Baixa-Chiado & Avenidas Hub", city: "Baixa-Chiado", territories: ["Baixa-Chiado", "Avenidas Novas"], tpsCount: 4 },
      { id: "hub_lisc_02", code: "HUB-LISC-002", name: "Parque das Nações & Alvalade Hub", city: "Parque das Nações", territories: ["Parque das Nações", "Alvalade"], tpsCount: 4 },
      { id: "hub_lisc_03", code: "HUB-LISC-003", name: "Belém & Estrela Hub", city: "Belém", territories: ["Belém", "Estrela"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_douro",
    code: "Pt-RD-021",
    name: "RP Douro",
    director: "Director Douro",
    region: "Douro",
    status: "Active",
    hubs: [
      { id: "hub_dou_01", code: "HUB-DOU-001", name: "Douro Norte Hub", city: "Vila Real", territories: ["Vila Real", "Sabrosa"], tpsCount: 4 },
      { id: "hub_dou_02", code: "HUB-DOU-002", name: "Douro Sul Hub", city: "Lamego", territories: ["Lamego", "Peso da Régua"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_alto_alentejo",
    code: "Pt-RD-022",
    name: "RP Alto Alentejo",
    director: "Director Alto Alentejo",
    region: "Alto Alentejo",
    status: "Active",
    hubs: [
      { id: "hub_aal_01", code: "HUB-AAL-001", name: "Portalegre & Elvas Hub", city: "Portalegre", territories: ["Portalegre", "Elvas", "Campo Maior"], tpsCount: 4 }
    ]
  },
  {
    id: "rp_baixo_alentejo",
    code: "Pt-RD-023",
    name: "RP Baixo Alentejo",
    director: "Director Baixo Alentejo",
    region: "Baixo Alentejo",
    status: "Active",
    hubs: [
      { id: "hub_bal_01", code: "HUB-BAL-001", name: "Beja & Serpa Hub", city: "Beja", territories: ["Beja", "Serpa", "Moura"], tpsCount: 4 }
    ]
  }
];

export const PORTUGAL_GEO: Region[] = NETWORK_23_REGIONS.map(rp => ({
  id: rp.id,
  name: rp.region,
  cities: rp.hubs.map(hub => ({
    id: hub.id,
    name: hub.city,
    districts: hub.territories.map((t, idx) => ({
      id: `${hub.id}-${idx}`,
      name: t
    }))
  }))
}));

// Helper to flatten geo structure for quick searching
export const FLATTENED_GEO = PORTUGAL_GEO.flatMap(region => 
  region.cities.flatMap(city => {
    if (city.districts && city.districts.length > 0) {
      return city.districts.map(district => ({
        id: district.id,
        name: district.name,
        type: 'district',
        city: city.name,
        region: region.name,
        fullName: `${city.name}, ${district.name} (${region.name})`,
        shortName: `${city.name}, ${district.name}`
      }));
    } else {
      return [{
        id: city.id,
        name: city.name,
        type: 'city',
        city: city.name,
        region: region.name,
        fullName: `${city.name} (${region.name})`,
        shortName: city.name
      }];
    }
  })
);

export function findBestGeoMatch(displayName: string) {
  const normalized = displayName.toLowerCase();
  
  // Sort FLATTENED_GEO such that longer names are checked first to prevent partial word conflicts
  const sortedGeo = [...FLATTENED_GEO].sort((a, b) => b.name.length - a.name.length);
  
  // 1. Check for specific district match (e.g., "Chiado", "Cascais Norte")
  for (const geo of sortedGeo) {
    if (geo.type === 'district') {
      const nameLower = geo.name.toLowerCase();
      if (normalized.includes(nameLower)) {
        return geo;
      }
    }
  }
  
  // 2. Check for city match (e.g., "Faro", "Portimão", "Cascais")
  for (const geo of sortedGeo) {
    const cityLower = geo.city.toLowerCase();
    if (normalized.includes(cityLower)) {
      return geo;
    }
  }
  
  // 3. Check for region match as fallback (e.g., "Algarve", "Madeira")
  for (const region of PORTUGAL_GEO) {
    if (normalized.includes(region.name.toLowerCase())) {
      const firstCity = region.cities[0];
      return {
        id: firstCity.id,
        name: firstCity.name,
        type: 'city',
        city: firstCity.name,
        region: region.name,
        fullName: `${firstCity.name} (${region.name})`,
        shortName: firstCity.name
      };
    }
  }
  
  return null;
}

export function getDispatcherForGeo(cityName: string, regionName: string) {
  const isPortimao = cityName.toLowerCase().includes('portimão') || cityName.toLowerCase().includes('portimao');
  const avatarUrl = isPortimao ? '/portimao_tp.jpg' : '';

  return {
    name: `Local Operator (${cityName})`,
    email: `tp.${cityName.toLowerCase().replace(/\s+/g, '')}@nordbase.pt`,
    phone: `+351 912 000 000`,
    avatar: avatarUrl,
    photoUrl: avatarUrl
  };
}

