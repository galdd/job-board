export interface Company {
  key: string;
  name: string;
  description: string;
  fundingStage: string;
  employees: string;
  primarySector: string;
  website: string;
  linkedin: string;
  logo: string; 
}
  
  export interface Job {
    company: Company;
    type: string;
    description: string;
    url: string;
  }
  