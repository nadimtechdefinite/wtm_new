export interface Scheme {
  name: string;
  title: string;
  logo: string;
  url: string;
}

export const SCHEMES: readonly Scheme[] = [
  {
    name: 'MGNREGA',
    title: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    logo: 'mgnrega.png',
    url: 'https://nrega.dord.gov.in/'
  },
  {
    name: 'NSAP',
    title: 'National Social Assistance Programme',
    logo: 'nsap.png',
    url: 'https://nsap.dord.gov.in/'
  },
  {
    name: 'RSETI',
    title: 'Rural Self Employment Training Institutes',
    logo: 'rseti.png',
    url: 'https://kaushal.dord.gov.in/'
  },
  {
    name: 'DDUGKY',
    title: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
    logo: 'ddugky.png',
    url: 'https://kaushal.dord.gov.in/'
  },
  {
    name: 'PMAYG',
    title: 'Pradhan Mantri Awaas Yojana - Gramin',
    logo: 'dash3-pmayg.png',
    url: 'https://pmayg.dord.gov.in/'
  },
  {
    name: 'PMGSY',
    title: 'Pradhan Mantri Gram Sadak Yojana',
    logo: 'dash2-pmgsy.png',
    url: 'https://pmgsy.nic.in/'
  },
  {
    name: 'NRLM',
    title: 'Deendayal Antayodaya Yojana - NRLM',
    logo: 'dash1-nrlm.png',
    url: 'https://kaushal.dord.gov.in/'
  },
  {
    name: 'SAGY',
    title: 'Saansad Adarsh Gram Yojana',
    logo: 'logo-sagy.png',
    url: 'https://saanjhi.dord.gov.in/'
  },
  {
    name: 'DISHA',
    title: 'District Development Coordination & Monitoring Committees',
    logo: 'disha.jpg',
    url: 'https://disha.gov.in/disha/'
  }
];